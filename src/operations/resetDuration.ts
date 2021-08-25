import { BlockLocation } from '../composition/BlockLocation'

export default function resetDuration({ block, section }: BlockLocation) {
  block.duration.numerator = 1
  block.duration.denominator = 1
  section.refresh()
  return section.findBlock(block)!
}
