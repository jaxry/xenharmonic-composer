import type { BlockLocation } from '../composition/BlockLocation'
import type Composition from '../composition/Composition'
import Section from '../composition/Section'

export default function newSection(composition: Composition, location: BlockLocation) {
  const newSection = new Section('New Section')
  composition.sections.push(newSection)
  composition.sortSections()
  location.block.element = newSection
}