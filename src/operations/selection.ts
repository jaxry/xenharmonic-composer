import type { BlockLocation } from '../composition/BlockLocation'
import { closestBlockOnTrack, horizontalNeighbor } from '../composition/find'

export function horizontalSelection(location: BlockLocation, dx: 1 | -1) {
  const neighbor = horizontalNeighbor(location, dx)
  return neighbor ? location.section.findBlock(neighbor)! : location
}

export function verticalSelection(location: BlockLocation, dy: 1 | -1) {
  const neighbor = closestBlockOnTrack(location, dy)
  return neighbor ? location.section.findBlock(neighbor)! : location
}