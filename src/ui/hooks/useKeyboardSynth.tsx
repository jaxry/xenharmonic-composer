
import { useCallback, useState } from 'react'
import { musicPlayer } from '../..'
import InstrumentPlayer from '../../InstrumentPlayer'
import Interval from '../../Interval'
import { keyboardToPitch } from '../../keyboardToPitch'
import useKeyPress from './useKeyPress'

const playingSamples: Record<string, InstrumentPlayer> = {}

export function useKeyboardSynth(intervals: Interval[]) {
  const [keyboardModulation, setKeyboardModulation] = useState<number>(1)

  useKeyPress(
    useCallback((e) => {
      if (playingSamples[e.code] || e.ctrlKey) {
        return
      }
      const pitch = keyboardToPitch(intervals, e.code)
      if (pitch) {
        playingSamples[e.code] = musicPlayer.playLivePitch(pitch, keyboardModulation)
      }
  
      e.preventDefault()
    }, [intervals, keyboardModulation]),
    useCallback((e) => {
      if (playingSamples[e.code]) {
        playingSamples[e.code].stop()
        delete playingSamples[e.code]
      }
      e.preventDefault()
    }, [])
  )

  return {
    setKeyboardModulation
  }
}
