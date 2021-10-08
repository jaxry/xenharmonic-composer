import type { BlockLocation } from '../composition/BlockLocation'

export default function shiftChain(location: BlockLocation, dx: -1 | 1) {
  const success = location.section.shiftChainToFreeSpace(location, dx)
  if (success) {
    location.section.refresh()
    return location.section.findBlock(location.block)!
  } else {
    return location
  }
}