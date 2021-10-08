import type Block from './Block'

export default class Chain {
  blocks: Block[]
  beginning: number
  end!: number

  constructor(block: Block, beginning = 0) {
    this.beginning = beginning
    this.blocks = [block]
  }

  updateEnd() {
    let stop = this.beginning
    for (const block of this.blocks) {
      stop += block.computedDuration
    }
    this.end = stop
  }

  ; *blockPositions(): Generator<[Block, number]> {
    let beginning = this.beginning
    for (const b of this.blocks) {
      yield [b, beginning]
      beginning += b.computedDuration
    }
  }
}
