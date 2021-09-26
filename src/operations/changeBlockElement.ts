import { BlockElement } from '../composition/Block'
import { BlockLocation } from '../composition/BlockLocation'

export default function changeBlockElement(location: BlockLocation, blockElement: BlockElement) {
  location.block.element = blockElement
  location.section.refresh()
}
