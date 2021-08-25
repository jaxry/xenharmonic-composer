import Block from '../composition/Block'
import { BlockLocation, BlockLocationWithSection } from '../composition/BlockLocation'
import Composition from '../composition/Composition'
import { firstBlock } from '../composition/find'
import Section from '../composition/Section'
import { last } from '../util'

export interface SectionNode {
  parentBlock?: Block
  parentSection?: Section
  section: Section
  beginning: number
  durationScale: number
}

export interface SequencerState {
  sectionStack: SectionNode[],
  selectedLocation: BlockLocation | null
}

export function initialState(composition: Composition): SequencerState {
  return {
    sectionStack: [{
      section: composition.rootSection,
      beginning: 0,
      durationScale: 1
    }],
    selectedLocation: null,
  }
}

export function setSelected(state: SequencerState, location: BlockLocation | null): SequencerState {
  return {
    ...state,
    selectedLocation: location
  }
}

export function leaveSection(state: SequencerState): SequencerState {
  const poppedNode = last(state.sectionStack)

  if (!poppedNode.parentSection) {
    return state
  }

  return {
    ...state,
    sectionStack: state.sectionStack.slice(0, state.sectionStack.length - 1),
    selectedLocation: poppedNode.parentSection.findBlock(poppedNode.parentBlock!)!
  }
}

export function drillIntoSection(state: SequencerState, location: BlockLocationWithSection): SequencerState {
  const block = location.block
  const section = block.element

  const prev = last(state.sectionStack)

  return {
    ...state,
    sectionStack: [
      ...state.sectionStack,
      { 
        parentBlock: block,
        parentSection: location.section,
        section,
        beginning: prev.beginning + prev.durationScale * location.beginning,
        durationScale: prev.durationScale * block.duration.quotient
      },
    ],
    selectedLocation: firstBlock(section)
  }
}

export function globalPosition(state: SequencerState) {
  const sectionInfo = last(state.sectionStack)
  return sectionInfo.beginning + state.selectedLocation!.beginning * sectionInfo.durationScale
}