import PianoRoll from '../PianoRoll'
import {
  insertModulation, Modulation, removeModulation, totalModulationAtTime,
} from '../../../modulation'
import PianoRollModulation from '../PianoRollModulation'
import { IdentityInterval } from '../../../scale'
import { getAndDelete } from '../../../util'

export function addModulationToPianoRoll (pianoRoll: PianoRoll, time: number) {
  const modulation = insertModulation(pianoRoll.modulations, IdentityInterval,
      time)

  const modulationElem = pianoRoll.newComponent(PianoRollModulation, modulation)
  modulationElem.onRightClick = (e) => {
    removeModulationFromPianoRoll(pianoRoll, modulation)
    e.preventDefault()
  }

  pianoRoll.modulationElements.set(modulation, modulationElem)
  pianoRoll.modulationContainer.append(modulationElem.element)

  const x = pianoRoll.timeToScreen(modulation.time)
  const y = pianoRoll.frequencyToScreen(
      440 * totalModulationAtTime(pianoRoll.modulations, modulation.time))
  modulationElem.setPosition(x, y, pianoRoll.octaveHeight, pianoRoll.height)

  // this.updateModulationPositions()
  // this.drawPitchLines()
  console.log(pianoRoll.modulations)
}

export function removeModulationFromPianoRoll (
    pianoRoll: PianoRoll, modulation: Modulation) {
  // TODO: Use modulationELem.modulation instead of map?
  const element = getAndDelete(pianoRoll.modulationElements, modulation)!
  element.remove()

  removeModulation(pianoRoll.modulations, modulation)
}