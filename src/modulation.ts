import Fraction from './Fraction'

export interface Modulation {
  time: number,
  interval: Fraction
}

export function modulateByInterval(ratio: number, interval: Fraction) {
  ratio *= interval.number
  return ratio / 2 ** Math.floor(Math.log2(ratio * Math.SQRT2))
}