import { BlockLocation } from '../composition/BlockLocation'

export default function shiftChain(location: BlockLocation, dx: -1 | 1) {
  location.section.shiftChainToFreeSpace(location, dx)
  return location.section.findBlock(location.block)!
}