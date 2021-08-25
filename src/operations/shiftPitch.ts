import Interval from '../Interval'
import Pitch from '../Pitch'
import Block from '../composition/Block'

export default function shiftPitch(block: Block, intervals: Interval[], shift: 1 | -1) {
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
