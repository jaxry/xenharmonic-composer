import type Interval from './Interval'
import Pitch from './Pitch'
import { mod } from './util'

const codeToIntervalIndex = (() => {
  const keyToCode = keyToCodeMap()

  // starting at the left and moving right and up diagonally across the keyboard
  const musicKeyboard = "awzsexdrcftvgybhunjimko,lp.;[/']".split('')

  const codeToIntervalIndex: Record<string, number> = {}
  
  for (let i = 0; i < musicKeyboard.length; i++) {
    const code = keyToCode[musicKeyboard[i]]
    codeToIntervalIndex[code] = i - Math.floor(musicKeyboard.length / 2)
  }

  return codeToIntervalIndex
})()


export function keyboardToPitch(intervals: Interval[], key: string): Pitch | null {
  const index = codeToIntervalIndex[key]

  if (index === undefined) {
    return null
  }

  const interval = intervals[mod(index, intervals.length)]

  return new Pitch(interval, Math.floor(index / intervals.length))
}

function keyToCodeMap() {
  const keyToCode: Record<string,string> = {
    ',': 'Comma',
    '.': 'Period',
    ';': 'Semicolon',
    '[': 'BracketLeft',
    ']': 'BracketRight',
    '/': 'Slash',
    "'": 'Quote',
  }
  
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  for (const letter of letters) {
    keyToCode[letter] = 'Key' + letter.toUpperCase()
  }

  return keyToCode
}