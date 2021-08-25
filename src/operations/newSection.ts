import { BlockLocation } from '../composition/BlockLocation'
import Section from '../composition/Section'

export default function newSection(location: BlockLocation) {
  const newSection = new Section('New Section', location.section)
  location.block.element = newSection
}