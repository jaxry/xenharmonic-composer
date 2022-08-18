import { squareWave } from './waves'
import { audioContext } from './audioContext'
import { Note } from './Note'
import Fraction from './Fraction'

export default function playNotes (notes: Set<Note>) {
  const time = audioContext.currentTime
  for (const note of notes) {
    playNote(note, time)
  }
}

function playNote (note: Note, currentTime: number) {
  const src = audioContext.createBufferSource()
  src.buffer = squareWave
  src.loop = true
  src.playbackRate.value = 2 ** note.octave * note.pitch.number

  const gain = audioContext.createGain()
  gain.gain.value = 0
  src.connect(gain).connect(audioContext.destination)

  const noteTime = currentTime + note.startTime

  src.start(noteTime)

  gain.gain.setValueAtTime(0, noteTime)
  gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.01)

  const endTime = noteTime + 0.01

  gain.gain.setTargetAtTime(0, endTime, 0.3)
  src.stop(endTime + 0.3 * 5)
}