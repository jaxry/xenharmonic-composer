import PianoRoll from '../PianoRoll'
import { addModulationToPianoRoll } from './modulations'

export function keyPressBehavior (pianoRoll: PianoRoll) {
  let mouseX = NaN
  let mouseY = NaN

  pianoRoll.grid.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  pianoRoll.grid.addEventListener('mouseenter', (e) => {
    document.addEventListener('keydown', keyPress)
  })

  pianoRoll.grid.addEventListener('mouseleave', (e) => {
    document.removeEventListener('keydown', keyPress)
  })

  function keyPress (e: KeyboardEvent) {
    if (e.repeat) {
      return
    }
    if (e.key === '`') {
      addModulationToPianoRoll(pianoRoll, mouseX, mouseY)
    }
  }
}