import { squareWave } from './waves'
import { audioContext } from './audioContext'
import { Note } from './Note'
import { Modulation, totalModulationAtTime } from './modulation'

export default function playNotes (
    notes: Set<Note>, modulations: Modulation[]) {
  const time = audioContext.currentTime

  for (const note of notes) {
    playNote(note, time, totalModulationAtTime(modulations, note.startTime))
  }
}

export function previewNote (note: Note, modulations: Modulation[]) {
  playNote(note,
      audioContext.currentTime - note.startTime,
      totalModulationAtTime(modulations, note.startTime))
}

function playNote (note: Note, currentTime: number, modulation: number) {
  const src = audioContext.createBufferSource()
  src.buffer = squareWave
  src.loop = true
  src.playbackRate.value = 2 ** note.octave * note.interval.number * modulation

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