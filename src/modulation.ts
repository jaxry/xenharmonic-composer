import Fraction from './Fraction'

export interface Modulation {
  time: number,
  interval: Fraction
}

export function modulateByInterval (ratio: number, interval: Fraction) {
  ratio *= interval.number
  return ratio / 2 ** Math.floor(Math.log2(ratio * Math.SQRT2))
}

export function totalModulationAtTime (
    modulations: Modulation[], time: number) {
  let total = 1

  for (const modulation of modulations) {
    if (modulation.time > time) {
      break
    }
    total *= modulation.interval.number
  }

  return total / 2 ** Math.floor(Math.log2(total * Math.SQRT2))
}