import Fraction from './Fraction'

export interface Note {
  pitch: Fraction
  octave: number
  startTime: number
  duration: number
}