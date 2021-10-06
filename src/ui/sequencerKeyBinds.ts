import { BlockLocationWithSection, isSection } from '../composition/BlockLocation'
import { keyboardToPitch } from '../keyboardToPitch'
import addBlock from '../operations/addBlock'
import changeBlockElement from '../operations/changeBlockElement'
import deleteBlock from '../operations/deleteBlock'
import { clearModulation, shiftModulation } from '../operations/modulation'
import newChain from '../operations/newChain'
import newSection from '../operations/newSection'
import resetDuration from '../operations/resetDuration'
import scaleDuration from '../operations/scaleDuration'
import { horizontalSelection, verticalSelection } from '../operations/selection'
import shiftChain from '../operations/shiftChain'
import shiftPitch from '../operations/shiftPitch'
import Pitch from '../Pitch'
import { playFreq } from '../play'
import { last } from '../util'
import { drillIntoSection, globalPosition, hideSectionSelect, leaveSection, SequencerState, setSelected, showSectionSelect } from './SequencerState'

export default function sequencerKeyBinds(e: KeyboardEvent, state: SequencerState): SequencerState {
  const { selectedLocation, composition } = state
  
  if (e.code === 'Escape') {
    if (state.showSectionSelect) {
      return hideSectionSelect(state)
    } else {
      return setSelected(state, null)
    }
  } else if (state.showSectionSelect || selectedLocation === null) {
    return state
  }

  const pitch = keyboardToPitch(composition.intervals, e.code)

  if (pitch && !hasModifierKey(e)) {
    changeBlockElement(selectedLocation, pitch)
    return {...state}
  } else if (e.code.startsWith('Digit')) {
    const digit = parseInt(e.code[5])
    return setSelected(state, scaleDuration(selectedLocation, digit, e.shiftKey))
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
      if (e.shiftKey) {
        return leaveSection(state)
      } else if (isSection(selectedLocation)) {
        return drillIntoSection(state, selectedLocation)
      }
      return state
    },
    'Space': () => {
      return setSelected(state, addBlock(selectedLocation))
    },
    'Backslash': () => {
      if (e.shiftKey) {
        clearModulation(globalPosition(state), composition.modulations)
      } else {
        changeBlockElement(selectedLocation, null)
      }
      return {...state}
    },
    'Backspace': () => {
      return setSelected(state, deleteBlock(selectedLocation))
    },
    'ArrowUp': () => {
      return setSelected(state, verticalSelection(selectedLocation, -1))
    },
    'ArrowDown': () => {
      return setSelected(state, verticalSelection(selectedLocation, 1))
    },
    'ArrowRight': () => {
      if (e.shiftKey) {
        return setSelected(state, shiftChain(selectedLocation, 1))
      } else {
        return setSelected(state, horizontalSelection(selectedLocation, 1))
      }
    },
    'ArrowLeft': () => {
      if (e.shiftKey) {
        return setSelected(state, shiftChain(selectedLocation, -1))
      } else {
        return setSelected(state, horizontalSelection(selectedLocation, -1))
      }
    },
    'Equal': () => {
      if (e.shiftKey) {
        const pos = globalPosition(state)
        shiftModulation(pos, composition.modulations, composition.intervals, 1)
        playFreq(composition.modulations.totalModulationAtPosition(pos))

      } else if (block.element instanceof Pitch) {
        shiftPitch(block, composition.intervals, 1)
      }
      return {...state}
    },
    'Minus': () => {
      if (e.shiftKey) {
        const pos = globalPosition(state)
        shiftModulation(pos, composition.modulations, composition.intervals, -1)
        playFreq(composition.modulations.totalModulationAtPosition(pos))
      } else if (block.element instanceof Pitch) {
        shiftPitch(block, composition.intervals, -1)
      }
      return {...state}
    },
    'Backquote': () => {
      return setSelected(state, resetDuration(selectedLocation))
    },
    'KeyT': () => {
      if (e.shiftKey) {
        return setSelected(state, newChain(selectedLocation))
      }
      return state
    },
    'KeyW': () => {
      if (e.shiftKey) {
        newSection(composition, selectedLocation)
        return drillIntoSection(state, selectedLocation as BlockLocationWithSection)
      }
      return state
    },
    'KeyF': () => {
      if (e.shiftKey) {
        return showSectionSelect(state)
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