import { BlockLocationWithSection, isSection } from '../composition/BlockLocation'
import { keyboardToPitch } from '../keyboardToPitch'
import * as operations from '../composition/operations'
import Pitch from '../Pitch'
import { playFreq } from '../play'
import { last } from '../util'
import type { SequencerState } from './SequencerState'
import * as stateHelper from './SequencerState'

export default function sequencerKeyBinds(e: KeyboardEvent, state: SequencerState): SequencerState {
  const { selectedLocation, composition } = state
  
  if (e.code === 'Escape') {
    if (state.showSectionSelect) {
      return stateHelper.hideSectionSelect(state)
    } else {
      return stateHelper.leaveSection(state)
    }
  } else if (state.showSectionSelect || selectedLocation === null) {
    return state
  }

  const pitch = keyboardToPitch(composition.intervals, e.code)

  if (pitch && !hasModifierKey(e)) {
    operations.changeBlockElement(selectedLocation, pitch)
    return {...state}

  } else if (e.code.startsWith('Digit')) {
    const digit = parseInt(e.code[5])
    return stateHelper.setSelected(state, operations.scaleDuration(selectedLocation, digit, e.shiftKey))
    
  } else {
    const binds = selectedBlockBinds(e, state)
    if (binds[e.code]) {
      return binds[e.code]()
    } 
  }

  return state
}

function selectedBlockBinds(e: KeyboardEvent, state: SequencerState): Record<string, () => SequencerState> {
  const composition = state.composition
  const selectedLocation = state.selectedLocation!
  const block = selectedLocation.block

  return {
    'Tab': () => {
      if (isSection(selectedLocation)) {
        return stateHelper.drillIntoSection(state, selectedLocation)
      }
      return state
    },
    'Space': () => {
      return stateHelper.setSelected(state, operations.addBlock(selectedLocation))
    },
    'Backslash': () => {
      if (e.shiftKey) {
        operations.clearModulation(stateHelper.globalPosition(state), composition.modulations)
      } else {
        operations.changeBlockElement(selectedLocation, null)
      }
      return {...state}
    },
    'Backspace': () => {
      return stateHelper.setSelected(state, operations.deleteBlock(selectedLocation))
    },
    'ArrowUp': () => {
      return stateHelper.setSelected(state, operations.verticalSelection(selectedLocation, -1))
    },
    'ArrowDown': () => {
      return stateHelper.setSelected(state, operations.verticalSelection(selectedLocation, 1))
    },
    'ArrowRight': () => {
      if (e.shiftKey) {
        return stateHelper.setSelected(state, operations.shiftChain(selectedLocation, 1))
      } else {
        return stateHelper.setSelected(state, operations.horizontalSelection(selectedLocation, 1))
      }
    },
    'ArrowLeft': () => {
      if (e.shiftKey) {
        return stateHelper.setSelected(state, operations.shiftChain(selectedLocation, -1))
      } else {
        return stateHelper.setSelected(state, operations.horizontalSelection(selectedLocation, -1))
      }
    },
    'Equal': () => {
      if (e.shiftKey) {
        const pos = stateHelper.globalPosition(state)
        operations.shiftModulation(pos, composition.modulations, composition.intervals, 1)
        playFreq(composition.modulations.totalModulationAtPosition(pos))

      } else if (block.element instanceof Pitch) {
        operations.shiftPitch(block, composition.intervals, 1)
      }
      return {...state}
    },
    'Minus': () => {
      if (e.shiftKey) {
        const pos = stateHelper.globalPosition(state)
        operations.shiftModulation(pos, composition.modulations, composition.intervals, -1)
        playFreq(composition.modulations.totalModulationAtPosition(pos))

      } else if (block.element instanceof Pitch) {
        operations.shiftPitch(block, composition.intervals, -1)
      }
      return {...state}
    },
    'Backquote': () => {
      return stateHelper.setSelected(state, operations.resetDuration(selectedLocation))
    },
    'KeyT': () => {
      if (e.shiftKey) {
        return stateHelper.setSelected(state, operations.newChain(selectedLocation))
      }
      return state
    },
    'KeyW': () => {
      if (e.shiftKey) {
        operations.newSection(composition, selectedLocation)
        return stateHelper.drillIntoSection(state, selectedLocation as BlockLocationWithSection)
      }
      return state
    },
    'KeyF': () => {
      if (e.shiftKey) {
        return stateHelper.showSectionSelect(state)
      }
      return state
    },
    'Enter': () => {
      const active = last(state.sectionStack)
      composition.play(active.section, active.beginning, active.tempo)
      return state
    }
  }
}

function hasModifierKey(e: KeyboardEvent) {
  return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey
}