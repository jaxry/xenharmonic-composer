import { copyObject } from './util'
import Note from './Note'
import Instrument from './Instrument'

export default class Phrase {
  notes: Note[]

  constructor (phraseString?: string) {
    if (phraseString) {
      this.notes = convert(phraseString)
    }
  }

  instrument (instrument: Instrument) {
    return this.copyModify(note => note.instrument = instrument)
  }

  octaveShift (shift: number) {
    return this.copyModify(note => note.pitch += shift * 12)
  }

  extendDuration (multiplier: number) {
    return this.copyModify(note => note.duration *= multiplier)
  }

  duplicateEach (count: number) {
    return this.copy(note => Array(count).fill(note))
  }

  protected copy (map: (note: Note) => Note | Note[]) {
    const copy = new Phrase()
    copy.notes = this.notes.flatMap(map)
    return copy
  }

  protected copyModify (modifier: (note: Note) => void) {
    const copy = new Phrase()
    copy.notes = this.notes.map(note => {
      const copy = copyObject(note)
      modifier(copy)
      return copy
    })
    return copy
  }
}

function convert (phrase: string) {
  return phrase.split(/\s+/).map(processNote)
}

function processNote (s: string) {
  const pitch = s.match(/^-?\d+/)
  const multiplyDuration = s.match(/(?<=\*)\d+/)?.[0] ?? 1
  const divideDuration = s.match(/(?<=\/)\d+/)?.[0] ?? 1

  const note = new Note()
  note.pitch = Number(pitch)
  note.duration = Number(multiplyDuration) / Number(divideDuration)

  return note
}
