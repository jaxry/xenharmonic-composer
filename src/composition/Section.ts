import Block from './Block'
import type { BlockLocation, ChainLocation } from './BlockLocation'
import Chain from './Chain'
import Track from './Track'

export default class Section {
  name: string
  tracks: Track[] = []
  duration!: number
  minBlockDuration!: number

  constructor(name = 'New Section') {
    this.name = name
    this.addTrackWithEmptyBlock()
    this.refresh()
  }

  findChain(chain: Chain): ChainLocation | undefined {
    for (let trackIndex = 0; trackIndex < this.tracks.length; trackIndex++) {
      const track = this.tracks[trackIndex]

      for (let chainIndex = 0; chainIndex < track.chains.length; chainIndex++) {
        if (track.chains[chainIndex] === chain) {
          return { trackIndex, chainIndex, section: this, track, chain }
        }
      }
    }
  }

  findBlock(block: Block): BlockLocation | undefined {
    for (let trackIndex = 0; trackIndex < this.tracks.length; trackIndex++) {
      const track = this.tracks[trackIndex]

      for (let chainIndex = 0; chainIndex < track.chains.length; chainIndex++) {
        const chain = track.chains[chainIndex]
        let beginning = chain.beginning

        for (let blockIndex = 0; blockIndex < chain.blocks.length; blockIndex++) {
          const b = chain.blocks[blockIndex]

          if (b === block) {
            return { trackIndex, chainIndex, blockIndex, section: this, track, chain, block, beginning }
          }

          beginning += b.computedDuration
        }
      }
    }
  }

  getOrMakeTrack(index: number) {
    if (this.tracks[index]) {
      return this.tracks[index]
    } else {
      const track = new Track()
      this.tracks[index] = track
      return track
    }
  }

  addTrackWithEmptyBlock(trackIndex = 0) {
    const block = new Block()

    this.tracks[trackIndex] = new Track([new Chain(block)])

    return block
  }

  refresh() {
    this.duration = 0
    this.minBlockDuration = Infinity

    for (const [trackIndex, track] of this.tracks.entries()) {

      for (const chain of track.chains) {
        chain.updateEnd()

        for (const block of chain.blocks) {
          this.minBlockDuration = Math.min(this.minBlockDuration, block.computedDuration)
        }
        this.duration = Math.max(this.duration, chain.end)
      }

      track.chains.sort((a, b) => a.beginning - b.beginning)

      this.findOverlappingChainsAndShift(trackIndex, track)
    }

    this.removeEmptyTracksFromEnd()
  }

  ; *chains() {
    for (const track of this.tracks) {
      for (const chain of track.chains) {
        yield chain
      }
    }
  }

  ; *blocksAtPosition(position: number) {
    for (const chain of this.chains()) {
      if (chain.beginning > position || chain.end < position) {
        continue
      }
      for (const [block, beginning] of chain.blockPositions()) {
        if (beginning === position) {
          yield block
        }
      }
    }
  }

  shiftChainToFreeSpace(location: ChainLocation, dx: 1 | -1) {
    const { trackIndex, chainIndex, chain } = location

    let nextTrackIndex = trackIndex + dx
    while (this.tracks[nextTrackIndex] && !this.tracks[nextTrackIndex].doesChainFit(chain)) {
      nextTrackIndex += dx
    }
  
    // tried shifting chain to the left and hit the edge
    if (nextTrackIndex < 0) {
      return false
    }
  
    this.tracks[trackIndex].chains.splice(chainIndex, 1)
  
    const moveToTrack = this.getOrMakeTrack(nextTrackIndex)
    moveToTrack.chains.push(chain)

    return true
  }

  private removeEmptyTracksFromEnd() {
    for (let i = this.tracks.length - 1; i >= 0; i--) {
      const track = this.tracks[i]
      if (track.chains.length === 0) {
        this.tracks.pop()
      } else {
        return
      }
    }
  }

  private findOverlappingChainsAndShift(trackIndex: number, track: Track) {
    for (let i = 1; i < track.chains.length; i++) {
      let a = track.chains[i - 1]
      let b = track.chains[i]
      if (b.beginning <= a.end) {
        const chainLocation = {section: this, trackIndex, track, chainIndex: i, chain: b}
        this.shiftChainToFreeSpace(chainLocation, 1)
        i--
      }
    }
  }
}