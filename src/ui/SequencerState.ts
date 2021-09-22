import Block from '../composition/Block'
import { BlockLocation, BlockLocationWithSection, isSection } from '../composition/BlockLocation'
import Composition from '../composition/Composition'
import { firstBlock } from '../composition/find'
import Section from '../composition/Section'
import { last } from '../util'

export interface SectionNode {
  parentBlock?: Block
  parentSection?: Section
  section: Section
  beginning: number
  tempo: number
}

export interface SequencerState {
  sectionStack: SectionNode[],
  selectedLocation: BlockLocation | null
  showSectionSelect: boolean
  sectionSearch: string
}

export function initialState(composition: Composition): SequencerState {
  return {
    sectionStack: [{
      section: composition.rootSection,
      beginning: 0,
      tempo: 1
    }],
    selectedLocation: null,
    showSectionSelect: false,
    sectionSearch: ''
  }
}

export function setSelected(state: SequencerState, location: BlockLocation | null): SequencerState {
  return {
    ...state,
    selectedLocation: location
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
        beginning: prev.beginning + prev.tempo * location.beginning,
        tempo: prev.tempo * block.duration.quotient
      },
    ],
    selectedLocation: firstBlock(section)
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

export function selectBlock(state: SequencerState, block: Block): SequencerState {
  const loc = activeSection(state).findBlock(block)!
  if (loc.block === state.selectedLocation?.block && isSection(loc)) {
    return drillIntoSection(state, loc)
  } else {
    return setSelected(state, loc)
  }
}

export function globalPosition(state: SequencerState) {
  const sectionInfo = last(state.sectionStack)
  return sectionInfo.beginning + state.selectedLocation!.beginning * sectionInfo.tempo
}

export function activeSection(state: SequencerState) {
  return last(state.sectionStack).section
}