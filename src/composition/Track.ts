import { last } from '../util'
import Chain from './Chain'

export default class Track {
  chains: Chain[]
  
  constructor(chains: Chain[] = []) { 
    this.chains = chains
  }

  order() {
    this.chains.sort((a, b) => a.beginning - b.beginning)
  }

  updateChainPositions() {
    for (const chain of this.chains) {
      chain.updatePosition()
    }
  }

  // chains must be ordered
  duration() {
    const lastChain = last(this.chains)
    return lastChain?.end || 0
  }

  minBlockDuration() {
    let min = Infinity

    for (const chain of this.chains) {
      for (const block of chain.blocks) {
        min = Math.min(block.computedDuration, min)
      }
    }

    return min
  }

  doesChainFit(chain: Chain) {
    for (const other of this.chains) {
      if (other !== chain && chain.end >= other.beginning && chain.beginning <= other.end) {
        return false
      }
    }
    return true
  }

  ; *blockPositions() {
    for (const chain of this.chains) {
      yield* chain.blockPositions()
    }
  }
}
