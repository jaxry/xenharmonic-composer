import type { BlockLocation } from '../composition/BlockLocation'

export default function scaleDuration({ section, chain, block }: BlockLocation, scale: number, scaleDenominator: boolean) {
  if (scaleDenominator) {
    block.duration.denominator *= scale
  } else {
    block.duration.numerator *= scale
  }
  block.duration.simplify()

  section.refresh()
  
  return section.findBlock(block)!
}
