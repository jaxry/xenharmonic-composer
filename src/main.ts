import { audioContext } from './audioContext'
import Phrase from './Phrase'
import Instrument from './Instrument'

// let currentTime = 0
// const tempoVariation = [0]
// const stepsPerUnit = 4
// const timePerStep = 1 / stepsPerUnit
// for (let i = 1; i < 16 * stepsPerUnit; i++) {
//   currentTime += timePerStep
//   tempoVariation.push(currentTime)
// }

const inst = new Instrument()

const melody = new Phrase(`0 7 4 7 0 7 4 -2 -3 5 0 5 -2 5 2 -2`)
const bass = new Phrase(`0 -2 -7 -2`)
    .extendDuration(2).octaveShift(-3).duplicateEach(2)

const song = [
  melody,
  // bass
]

function playSong (song: Phrase[]) {
  const startTime = audioContext.currentTime
  for (const phrase of song) {
    let time = 0
    for (const note of phrase.notes) {
      const t = Math.max(0, time + (Math.random() - 0.5) * 0.05)
      inst.play(startTime + t * 0.4, note)
      time += note.duration
    }
  }
}

window.addEventListener('click', () => {
  playSong(song)
})

// TODO: start phrase on the note of another phrase
