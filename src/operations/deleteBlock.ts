import { BlockLocation } from '../composition/BlockLocation'
import { closestBlockOnTrack, horizontalNeighbor } from '../composition/find'

export default function deleteBlock(location: BlockLocation): BlockLocation {
  const { section, track, chainIndex, chain, blockIndex } = location

  let neighbor = closestBlockOnTrack(location, 1) ||
    closestBlockOnTrack(location, -1) ||
    horizontalNeighbor(location, -1) ||
    horizontalNeighbor(location, 1)

  chain.blocks.splice(blockIndex, 1)
  chain.updatePosition()

  if (chain.blocks.length === 0) {
    track.chains.splice(chainIndex, 1)
  }

  if (!neighbor) {
    const block = section.addTrackWithEmptyBlock()
    section.refresh()
    return section.findBlock(block)!
  }

  section.refresh()

  return section.findBlock(neighbor)!
}
