import Fraction from '../Fraction'
import type Pitch from '../Pitch'
import Section from './Section'

export type BlockElement = Pitch | Section | null

export default class Block {
  element: BlockElement = null
  duration: Fraction

  constructor(duration = new Fraction(1)) {
    this.duration = duration
  }

  get computedDuration() {
    return this.element instanceof Section ? 
      this.duration.quotient * this.element.duration : 
      this.duration.quotient
  }
}
