// import App from './ui/components/App'
//
// const app = new App(document.getElementById('app')!)
//
// export default app

import { audioContext } from './audioContext'
import { squareWave } from './waves'
import { getAndDelete, mod } from './util'

interface Note {
  src: AudioBufferSourceNode,
  gain: GainNode
}

function makeNote (): Note {
  const src = audioContext.createBufferSource()
  src.buffer = squareWave
  src.loop = true

  const panner = audioContext.createStereoPanner()

  const gain = audioContext.createGain()
  gain.gain.value = 0
  src.connect(gain).connect(panner).connect(audioContext.destination)

  return { src, gain }
}

let nextNote = makeNote()

function playNote (ratio: number, velocity: number) {
  const note = nextNote

  note.src.playbackRate.value = ratio

  note.gain.gain.linearRampToValueAtTime(0.25 * velocity,
      audioContext.currentTime + 0.005)

  note.src.start()

  nextNote = makeNote()

  return note
}

function stopNote (note: Note) {
  const fade = 0.05
  note.gain.gain.setTargetAtTime(0, audioContext.currentTime, fade)
  note.src.stop(audioContext.currentTime + fade * 5)
}

const pitches = [
  1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8]
// const pitches = [1,8/7,7/6,6/5,5/4,4/3,7/5,10/7,3/2,8/5,5/3,12/7,7/4,]

let basePitch = 1
let basePitchIndex = 0

function getRatio (key: number) {
  key -= basePitchIndex
  const octave = Math.floor(key / pitches.length)
  const octaveKey = mod(key, pitches.length)
  return basePitch * pitches[octaveKey] * (2 ** octave)
}

function setBasePitch (key: number) {
  const relativeKey = mod(key, pitches.length)
  const diff = relativeKey - basePitchIndex
  const octave = Math.floor(diff / pitches.length)
  basePitch *= pitches[mod(diff, pitches.length)] * (2 ** octave)
  basePitchIndex = relativeKey
}

const keyToNote = new Map<number, Note>()

function onMIDIMessage (event: MIDIMessageEvent) {
  const MIDI_ON = 146
  const [onOrOff, key, velocity] = event.data
  if (onOrOff === MIDI_ON) {
    const relativeKey = key - 36 - pitches.length * 3
    if (key < 36 + pitches.length) {
      setBasePitch(relativeKey)
    }
    const note = playNote(getRatio(relativeKey), velocity / 100)
    keyToNote.set(key, note)
  } else {
    const note = getAndDelete(keyToNote, key)!
    stopNote(note)
  }

}

navigator.requestMIDIAccess().then((midiAccess) => {
  midiAccess.inputs.forEach(input => {
    input.onmidimessage = onMIDIMessage as any
  })
})