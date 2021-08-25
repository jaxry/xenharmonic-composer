import Section from '../composition/Section'
import Pitch from '../Pitch'
import Block from '../composition/Block'
import { copy } from '../util'
import { BlockLocation } from '../composition/BlockLocation'

export default function addBlock(location: BlockLocation, element?: Pitch | Section): BlockLocation {
  const { section, block, chain, blockIndex } = location

  const newBlock = new Block()

  if (element) {
    newBlock.element = element
  } else if (block.element) {
    newBlock.element = copy(block.element)
  }
  newBlock.duration.numerator = block.duration.numerator
  newBlock.duration.denominator = block.duration.denominator

  chain.blocks.splice(blockIndex + 1, 0, newBlock)

  section.refresh()

  return section.findBlock(newBlock)!
}
