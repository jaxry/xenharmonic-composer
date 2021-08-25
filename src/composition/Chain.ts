import Block from './Block'

let nextChainId = 1

export default class Chain {
  id = nextChainId++
  blocks: Block[]
  beginning: number
  end!: number
  attachedTo?: Block

  constructor(blocks: Block[] = [], beginning = 0) {
    this.beginning = beginning
    this.blocks = blocks
  }

  updatePosition() {
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
