import type Block from '../composition/Block'
import { BlockLocation, BlockLocationWithSection, isSection } from '../composition/BlockLocation'
import type Composition from '../composition/Composition'
import { firstBlock } from '../composition/find'
import type Section from '../composition/Section'
import Pitch from '../Pitch'
import { playFreq } from '../play'
import { last, mapIter } from '../util'

export interface SequencerState {
  composition: Composition
  sectionStack: SectionNode[],
  selectedLocation: BlockLocation | null
}

export interface SectionNode {
  parentBlock?: Block
  section: Section
  beginning: number
  tempo: number
}

export function initialState(composition: Composition) : SequencerState {
  return {
    composition,
    sectionStack: [{
      section: composition.rootSection,
      beginning: 0,
      tempo: 1
    }],
    selectedLocation: null,
  }
}

// state transformers

export function setSelected(state: SequencerState, location: BlockLocation | null) {
  return {
    ...state,
    selectedLocation: location,
  }
}

export function drillIntoSection(state: SequencerState, location: BlockLocationWithSection) {
  const block = location.block
  const section = block.element

  // this section may contain sections that have changed in duration since the last refresh
  // we refresh again to make sure there are no overlapping blocks
  section.refresh()

  const prev = last(state.sectionStack)

  return {
    ...state,
    sectionStack: [
      ...state.sectionStack,
      { 
        parentBlock: block,
        section,
        beginning: prev.beginning + prev.tempo * location.beginning,
        tempo: prev.tempo * block.duration.quotient,
      },
    ],
    selectedLocation: firstBlock(section),
  }
}

export function leaveSection(state: SequencerState) {
  const parentBlock = last(state.sectionStack).parentBlock

  if (!parentBlock) {
    return state
  }

  const sectionStack = state.sectionStack.slice(0, state.sectionStack.length - 1)
  const section = last(sectionStack).section

  section.refresh()

  return {
    ...state,
    sectionStack,
    selectedLocation: section.findBlock(parentBlock)!
  }
}

export function selectBlock(state: SequencerState, block: Block) {
  const loc = last(state.sectionStack).section.findBlock(block)!
  if (loc.block === state.selectedLocation?.block && isSection(loc)) {
    return drillIntoSection(state, loc)
  } else {
    return setSelected(state, loc)
  }
}

// state selectors

export function selectedBlock(state: SequencerState) {
  return state.selectedLocation?.block
}

export function activeSection(state: SequencerState) {
  return last(state.sectionStack).section
}

export function globalPosition(state: SequencerState) {
  const { beginning, tempo } = last(state.sectionStack)
  return beginning + tempo * state.selectedLocation!.beginning
}

export function modulationsBetween(state: SequencerState) {
  const { beginning, tempo, section } = last(state.sectionStack)
  const end = beginning + tempo * section.duration

  return mapIter(state.composition.modulations.modulationsBetween(beginning, end), (m) => {
    return {
      modulation: m,
      position: (m.position - beginning) / tempo
    }
  })
}

// misc

export function usePlayPitch() {
  let prevPitch: Pitch

  return (newState: SequencerState) => {
    const elem = newState.selectedLocation?.block.element
    if (elem instanceof Pitch && elem !== prevPitch) {
      const root = newState.composition.modulations.totalModulationAtPosition(globalPosition(newState))
      playFreq(root * elem.ratio)
      prevPitch = elem
    }
  }
}