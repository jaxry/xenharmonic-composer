import Fraction from './Fraction'

export interface Note {
  interval: Fraction
  octave: number
  startTime: number
  duration: number
}