import Pitch from '../Pitch'
import Composition from '../composition/Composition'
import shiftPitch from '../operations/shiftPitch'
import changePitch from '../operations/changePitch'
import resetDuration from '../operations/resetDuration'
import newChain from '../operations/newChain'
import deleteBlock from '../operations/deleteBlock'
import addBlock from '../operations/addBlock'
import { horizontalSelection, verticalSelection } from '../operations/selection'
import shiftChain from '../operations/shiftChain'
import { clearModulation, shiftModulation } from '../operations/modulation'
import { BlockLocationWithSection, isSection } from '../composition/BlockLocation'
import { keyboardToPitch } from '../keyboardToPitch'
import scaleDuration from '../operations/scaleDuration'
import newSection from '../operations/newSection'
import { drillIntoSection, globalPosition, leaveSection, SequencerState, setSelected } from './SequencerState'

type Props = {
  e: KeyboardEvent,
  composition: Composition,
  state: SequencerState
}

export default function sequencerKeyBinds(props: Props): SequencerState {
  const  { e, composition, state} = props
  const selectedLocation = state.selectedLocation

  if (selectedLocation === null) {
    return state
  }

  const pitch = keyboardToPitch(composition.intervals, e.code)

  if (pitch && !e.altKey && !e.ctrlKey) {
    if (e.shiftKey) {
      return setSelected(state, addBlock(selectedLocation, pitch))
    } else {
      changePitch(selectedLocation.block, pitch)
      return {...state}
    }
  } else if (e.code.startsWith('Digit')) {
    const digit = parseInt(e.code[5])
    return setSelected(state, scaleDuration(selectedLocation, digit, e.shiftKey))
  } else {
    const binds = singleKeyBinds(props)
    if (binds[e.code]) {
      return binds[e.code]()
    } 
  }

  return state
}

function singleKeyBinds(props: Props): Record<string, () => SequencerState> {
  const { e, state, composition } = props
  const selectedLocation = state.selectedLocation!
  const block = selectedLocation.block

  return {
    'Escape': () => {
      return leaveSection(state)
    },
    'Enter': () => {
      if (isSection(selectedLocation)) {
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
        changePitch(selectedLocation.block)
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
      if (e.altKey) {
        return setSelected(state, shiftChain(selectedLocation, 1))
      } else {
        return setSelected(state, horizontalSelection(selectedLocation, 1))
      }
    },
    'ArrowLeft': () => {
      if (e.altKey) {
        return setSelected(state, shiftChain(selectedLocation, -1))
      } else {
        return setSelected(state, horizontalSelection(selectedLocation, -1))
      }
    },
    'Equal': () => {
      if (e.shiftKey) {
        shiftModulation(globalPosition(state), composition.modulations, composition.intervals, 1)
      } else if (block.element instanceof Pitch) {
        shiftPitch(block, composition.intervals, 1)
      }
      return {...state}
    },
    'Minus': () => {
      if (e.shiftKey) {
        shiftModulation(globalPosition(state), composition.modulations, composition.intervals, -1)
      } else if (block.element instanceof Pitch) {
        shiftPitch(block, composition.intervals, -1)
      }
      return {...state}
    },
    'Backquote': () => {
      return setSelected(state, resetDuration(selectedLocation))
    },
    'KeyT': () => {
      if (e.altKey) {
        return setSelected(state, newChain(selectedLocation))
      }
      return state
    },
    'KeyW': () => {
      if (e.altKey) {
        newSection(selectedLocation)
        return drillIntoSection(state, selectedLocation as BlockLocationWithSection)
      }
      return state
    }
  }
}
