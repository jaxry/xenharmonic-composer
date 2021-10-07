import Fraction from '../Fraction'
import Pitch from '../Pitch'
import { copy } from '../util'
import Section from './Section'

export type BlockElement = Pitch | Section | null

export default class Block {
  element: BlockElement
  duration: Fraction

  constructor(copyBlock?: Block) {
    if (copyBlock) {
      this.element = copyBlock.element instanceof Pitch ?
        copy(copyBlock.element) :
        copyBlock.element
      this.duration = copy(copyBlock.duration)
    } else {
      this.element = null
      this.duration = new Fraction(1, 1)
    }
  }

  get computedDuration() {
    return this.element instanceof Section ? 
      this.duration.quotient * this.element.duration : 
      this.duration.quotient
  }
}
