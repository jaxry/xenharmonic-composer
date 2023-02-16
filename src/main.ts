import { audioContext } from './audioContext'
import Phrase from './Phrase'
import Instrument from './Instrument'
import Note from './Note'
import { getOrMake } from './util'

const melody = new Phrase(`0 7 4 7 0 7 4 -2 -3 5 0 5 -2 5 2 -2`).instrument(new Instrument())
const bass = new Phrase(`0 -2 -7 -2`)
    .extendDuration(2).octaveShift(-3).duplicateEach(2).instrument(new Instrument())

const song = [
  melody,
  bass
]

const bpm = 120
const unitDuration = 60 / bpm

function playSong (song: Phrase[]) {
  const noteMap = new Map<Instrument, Note[]>()

  for (const phrase of song) {
    let time = 0
    for (const note of phrase.notes) {
      const randomTimeOffset = (Math.random() - 0.5) * 0.05 * unitDuration
      note.startTime = Math.max(0, time + randomTimeOffset)
      time += note.duration * unitDuration

      const list = getOrMake(noteMap, note.instrument, () => [])
      list.push(note)
    }
  }

  const startTime = audioContext.currentTime
  for (const [instrument, notes] of noteMap) {
    notes.sort((a, b) => a.startTime - b.startTime)
    for (const [prevNote, note, nextNote] of adjacent(notes)) {
      instrument.queue(startTime + note.startTime, note, prevNote, nextNote)
    }
  }
}

window.addEventListener('click', () => {
  playSong(song)
})

function* adjacent<T> (arr: T[]): Iterable<[T | undefined, T, T | undefined]> {
  for (let i = 0; i < arr.length; i++) {
    yield [arr[i - 1], arr[i], arr[i + 1]]
  }
}

// TODO: start phrase on the note of another phrase
