import type Block from './Block'
import type { BlockLocation } from './BlockLocation'
import type Section from './Section'
import type Track from './Track'

export function closestBlockOnTrack(location: BlockLocation, dy: 1 | -1) {
  const { track, chain, chainIndex, blockIndex } = location

  const neighborBlockIndex = blockIndex + dy

  // if at beginning of chain, select last block in chain above
  if (neighborBlockIndex < 0 && chainIndex > 0) {
    const neighborChain = track.chains[chainIndex - 1]
    return neighborChain.blocks[neighborChain.blocks.length - 1]
  }

  // if at end of chain, select first block in chain below
  if (neighborBlockIndex > chain.blocks.length - 1 && chainIndex < track.chains.length - 1) {
    const neighborChain = track.chains[chainIndex + 1]
    return neighborChain.blocks[0]
  }

  return chain.blocks[neighborBlockIndex]
}

export function closestBlockToPosition(track: Track, position: number) {
  let closestDistance = Infinity
  let closestBlock: Block | undefined = undefined

  for (const [b, beginning] of track.blockPositions()) {
    const distance = Math.abs(position - beginning)
    if (distance > closestDistance) {
      return closestBlock || b
    }
    closestDistance = distance
    closestBlock = b
  }
  return closestBlock
}

export function closestFilledTrack(section: Section, trackIndex: number, dx: 1 | -1) {
  let nextNeighborTrackIndex = trackIndex + dx
  while (section.tracks[nextNeighborTrackIndex]) {
    const track = section.tracks[nextNeighborTrackIndex]
    if (track.chains.length > 0) {
      return track
    }
    nextNeighborTrackIndex += dx
  }
}

export function horizontalNeighbor(location: BlockLocation, dx: 1 | -1) {
  const { section, trackIndex, beginning } = location

  const neighborTrack = closestFilledTrack(section, trackIndex, dx)

  if (!neighborTrack) {
    return
  }

  return closestBlockToPosition(neighborTrack, beginning)
}

export function firstBlock(section: Section): BlockLocation {
  for (const chain of section.chains()) {
    for (const block of chain.blocks) {
      return section.findBlock(block)!
    }
  }

  // section should always have at least one block
  return undefined as never
}



