import Fraction from '../Fraction'
import Pitch from '../Pitch'
import Section from './Section'

let nextBlockId = 1

export default class Block {
  id = nextBlockId++
  element?: Pitch | Section | null = null
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
