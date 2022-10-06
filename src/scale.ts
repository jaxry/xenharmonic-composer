import Fraction from './Fraction'
import { findClosest } from './util'

export const scale = [
    new Fraction(3, 1),
    new Fraction(3*3, 1),
    new Fraction(5, 1),
    new Fraction(3*5, 1),
    new Fraction(5*3*3, 1),
    new Fraction(5, 3),
]

const inverses = scale.map(interval => {
  return new Fraction(interval.denominator, interval.numerator)
})
scale.push(...inverses)

for (const interval of scale) {
  const twos = Math.floor(Math.log2(interval.number))
  if (twos > 0) {
    interval.denominator *= 2 ** twos
  } else {
    interval.numerator *= 2 ** -twos
  }
}

scale.push(new Fraction(1, 1))

scale.sort((a, b) => a.number - b.number)

export function frequencyToPitch (
    scale: Fraction[], rootFrequency: number, frequency: number) {
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