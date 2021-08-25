import Track from './Track'
import Block from './Block'
import Chain from './Chain'
import { BlockLocation, ChainLocation } from './BlockLocation'

export default class Section {
  name: string
  tracks: Track[] = []
  duration!: number
  minBlockDuration!: number
  containedIn: Section[]

  constructor(name = 'New Section', containedIn?: Section) {
    this.name = name

    if (containedIn) {
      this.containedIn = [containedIn]
    } else {
      this.containedIn = []
    }

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

    this.tracks[trackIndex] = new Track([
      new Chain([
        block
      ])
    ])

    return block
  }

  shiftChainToFreeSpace(location: ChainLocation, dx: 1 | -1, refresh = true) {
    const { trackIndex, chainIndex, chain } = location

    let nextTrackIndex = trackIndex + dx
    while (this.tracks[nextTrackIndex] && !this.tracks[nextTrackIndex].doesChainFit(chain)) {
      nextTrackIndex += dx
    }
  
    if (nextTrackIndex < 0) {
      return
    }
  
    this.tracks[trackIndex].chains.splice(chainIndex, 1)
  
    const moveToTrack = this.getOrMakeTrack(nextTrackIndex)
    moveToTrack.chains.push(chain)

    if (refresh) {
      this.refresh()
    }
  }

  refresh() {
    this.duration = 0
    this.minBlockDuration = Infinity

    for (const [trackIndex, track] of this.tracks.entries()) {
      track.updateChainPositions()
      track.order()
      this.findOverlappingChainsAndShift(trackIndex, track)

      this.duration = Math.max(this.duration, track.duration())
      this.minBlockDuration = Math.min(this.minBlockDuration, track.minBlockDuration())
    }

    this.removeEmptyTracksFromEnd()

    for (const parent of this.containedIn) {
      parent.refresh()
    }
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
        this.shiftChainToFreeSpace({section: this, trackIndex, track, chainIndex: i, chain: b}, 1, false)
        i--
      }
    }
  }
}