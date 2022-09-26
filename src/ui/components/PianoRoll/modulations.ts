import PianoRoll from '../PianoRoll'
import {
  insertModulation, Modulation, removeModulation, totalModulationAtTime,
} from '../../../modulation'
import PianoRollModulation from '../PianoRollModulation'
import { find } from '../../../util'
import { drawPitchLines } from './drawPitchLines'

export function addModulationToPianoRoll (
    pianoRoll: PianoRoll, mouseX: number, mouseY: number) {
  const { time, interval } = pianoRoll.mouseToNote(
      mouseX, mouseY, { openModulation: true })

  const modulation = insertModulation(pianoRoll.modulations, interval, time)

  let modulationElem = find(pianoRoll.modulationElements.values(),
      (elem) => elem.modulation.time === time)

  if (!modulationElem) {
    modulationElem = makeModulationElement(pianoRoll, modulation)
  }

  const x = pianoRoll.timeToScreen(modulation.time)
  const y = pianoRoll.frequencyToScreen(
      440 * totalModulationAtTime(pianoRoll.modulations, modulation.time))
  modulationElem.setPosition(x, y, pianoRoll.octaveHeight, pianoRoll.height)

  drawPitchLines(pianoRoll)
}

export function removeModulationFromPianoRoll (
    pianoRoll: PianoRoll, element: PianoRollModulation) {

  pianoRoll.modulationElements.delete(element)
  element.remove()

  const modulation = element.modulation
  removeModulation(pianoRoll.modulations, modulation)

  drawPitchLines(pianoRoll)
}

function makeModulationElement (pianoRoll: PianoRoll, modulation: Modulation) {
  const modulationElem = pianoRoll.newComponent(PianoRollModulation, modulation)
  pianoRoll.modulationElements.add(modulationElem)
  pianoRoll.modulationContainer.append(modulationElem.element)
  modulationElem.onRightClick = () => {
    removeModulationFromPianoRoll(pianoRoll, modulationElem)
  }

  return modulationElem
}