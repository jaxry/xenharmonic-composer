import { last } from '../util'
import type Chain from './Chain'

export default class Track {
  chains: Chain[]
  
  constructor(chains: Chain[] = []) { 
    this.chains = chains
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
