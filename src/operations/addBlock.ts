import Block from '../composition/Block'
import type { BlockLocation } from '../composition/BlockLocation'

export default function addBlock(location: BlockLocation): BlockLocation {
  const { section, block, chain, blockIndex } = location

  const newBlock = new Block(block)

  chain.blocks.splice(blockIndex + 1, 0, newBlock)

  section.refresh()

  return section.findBlock(newBlock)!
}
