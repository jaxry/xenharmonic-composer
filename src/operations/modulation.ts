import Interval from '../Interval'
import Modulations from '../composition/Modulations'
import { mod } from '../util'

export function shiftModulation(position: number, modulations: Modulations, intervals: Interval[], shift: 1 | -1) {
  let modulation = modulations.getModulationAtPosition(position)

  if (!modulation) {
    return modulations.addAtPosition(position, intervals[0])
  }

  const index = intervals.findIndex(x => x === modulation!.interval)

  if (index === -1) {
    modulation.interval = intervals[0]
  } else {
    modulation.interval = intervals[mod(index + shift, intervals.length)]
  }
}

export function clearModulation(position: number, modulations: Modulations) {
  modulations.removeAtPosition(position)
}