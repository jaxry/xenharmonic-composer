import type Interval from '../Interval'
import Pitch from '../Pitch'
import { mod } from '../util'
import Block, { BlockElement } from './Block'
import type { BlockLocation } from './BlockLocation'
import Chain from './Chain'
import type Composition from './Composition'
import { closestBlockOnTrack, horizontalNeighbor } from './find'
import type Modulations from './Modulations'
import Section from './Section'

export function addBlock(location: BlockLocation): BlockLocation {
  const { section, block, chain, blockIndex } = location

  const newBlock = new Block(block)

  chain.blocks.splice(blockIndex + 1, 0, newBlock)

  section.refresh()

  return section.findBlock(newBlock)!
}

export function changeBlockElement(location: BlockLocation, blockElement: BlockElement) {
  location.block.element = blockElement
  location.section.refresh()
}

export function deleteBlock(location: BlockLocation): BlockLocation {
  const { section, track, chainIndex, chain, blockIndex } = location

  let neighbor = closestBlockOnTrack(location, 1) ||
    closestBlockOnTrack(location, -1) ||
    horizontalNeighbor(location, -1) ||
    horizontalNeighbor(location, 1)

  chain.blocks.splice(blockIndex, 1)

  if (chain.blocks.length === 0) {
    track.chains.splice(chainIndex, 1)
  }

  if (!neighbor) {
    neighbor = section.addTrackWithEmptyBlock()
  }

  section.refresh()

  return section.findBlock(neighbor)!
}

export function resetDuration({ block, section }: BlockLocation) {
  block.duration.numerator = 1
  block.duration.denominator = 1
  section.refresh()
  return section.findBlock(block)!
}

export function scaleDuration({ section, block }: BlockLocation, scale: number, scaleDenominator: boolean) {
  if (scaleDenominator) {
    block.duration.denominator *= scale
  } else {
    block.duration.numerator *= scale
  }
  block.duration.simplify()

  section.refresh()
  
  return section.findBlock(block)!
}

export function shiftPitch(block: Block, intervals: Interval[], shift: 1 | -1) {
  if (!(block.element instanceof Pitch)) {
    block.element = new Pitch(intervals[0])
  }
  const pitch = block.element

  const index = intervals.findIndex(x => x === pitch.interval)

  let nextIndex = index === -1 ? 0 : index + shift
  let nextOctave = pitch.octave

  if (nextIndex >= intervals.length) {
    nextIndex = 0
    nextOctave++
  } else if (nextIndex < 0) {
    nextOctave--
    nextIndex = intervals.length - 1
  }

  block.element = new Pitch(intervals[nextIndex], nextOctave)
}

export function newChain(location: BlockLocation): BlockLocation {
  const { section, trackIndex, beginning, block } = location

  const newBlock = new Block(block)
  const newChain = new Chain(newBlock, beginning)

  section.getOrMakeTrack(trackIndex + 1).chains.push(newChain)
  section.refresh()

  return section.findBlock(newBlock)!
}

export function shiftChain(location: BlockLocation, dx: -1 | 1) {
  const success = location.section.shiftChainToFreeSpace(location, dx)
  if (success) {
    location.section.refresh()
    return location.section.findBlock(location.block)!
  } else {
    return location
  }
}

export function newSection(composition: Composition, location: BlockLocation) {
  const newSection = new Section('New Section')
  composition.sections.push(newSection)
  location.block.element = newSection
}

export function horizontalSelection(location: BlockLocation, dx: 1 | -1) {
  const neighbor = horizontalNeighbor(location, dx)
  return neighbor ? location.section.findBlock(neighbor)! : location
}

export function verticalSelection(location: BlockLocation, dy: 1 | -1) {
  const neighbor = closestBlockOnTrack(location, dy)
  return neighbor ? location.section.findBlock(neighbor)! : location
}

export function shiftModulation(position: number, modulations: Modulations, intervals: Interval[], shift: 1 | -1) {
  let modulation = modulations.getModulationAtPosition(position)

  if (!modulation) {
    return modulations.addAtPosition(position, intervals[0])
  }

  const index = intervals.findIndex(x => x === modulation!.interval)

  if (index === -1) {
    modulation.interval = intervals[0]
  } else {
    modulation.interval = intervals[mod(index + shift, intervals.length)]
  }
}

export function clearModulation(position: number, modulations: Modulations) {
  modulations.removeAtPosition(position)
}