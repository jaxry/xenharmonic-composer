import Fraction from './Fraction'
import { findClosest } from './util'

export const scale = [
  new Fraction(1, 1),
  new Fraction(16, 15),
  new Fraction(9, 8),
  new Fraction(6, 5),
  new Fraction(5, 4),
  new Fraction(4, 3),
  new Fraction(25, 18),
  new Fraction(36, 25),
  new Fraction(3, 2),
  new Fraction(8, 5),
  new Fraction(5, 3),
  new Fraction(9, 5),
  new Fraction(15, 8),
]

export function frequencyToPitch (
    frequency: number, rootFrequency: number, scale: Fraction[]) {
  let octave = Math.floor(Math.log2(frequency / rootFrequency))

  // number between 1 and 2 representing the unquantized ratio of the
  // note relative to the root frequency
  const ratio = frequency / (rootFrequency * 2 ** octave)

  let interval = findClosest(scale, ratio, note => note.number)

  // if unquantized pitch is closer to the root note in the octave above,
  // quantize to that root note instead
  if (2 * scale[0].number - ratio < Math.abs(interval.number - ratio)) {
    interval = scale[0]
    octave += 1
  }

  return {
    interval,
    octave,
  }
}