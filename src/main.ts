import { audioContext } from './audioContext'
import { sawWave } from './waves'

function play (pitch: number, time: number) {
  const src = audioContext.createBufferSource()
  src.buffer = sawWave
  src.loop = true
  src.playbackRate.value = 2 ** (pitch / 12)

  const gain = audioContext.createGain()
  gain.gain.value = 0
  src.connect(gain).connect(audioContext.destination)

  const noteTime = time

  src.start(noteTime, Math.random() * src.buffer.length / src.buffer.sampleRate)

  gain.gain.setValueAtTime(0, noteTime)
  gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.005)

  const endTime = noteTime + 0.02

  gain.gain.setTargetAtTime(0, endTime, 0.4)
  src.stop(endTime + 0.4 * 5)
}

const notes = [0, 4, 7, 4, 7, 4, 0, 4]

const song = [
  { notes, transpose: 0 },
  { notes, transpose: -2 },
  { notes, transpose: -4 },
  { notes, transpose: -5 },
  { notes, transpose: -7 },
  { notes, transpose: -9 },
  { notes, transpose: -5 },
  { notes, transpose: -5 },
]

function playSong () {
  const startTime = audioContext.currentTime
  let time = 0
  for (const { notes, transpose } of song) {
    for (const note of notes) {
      play(note + transpose, startTime + time)
      time += 0.4
    }
  }

}

window.addEventListener('click', () => {
  playSong()
})
// playSong()