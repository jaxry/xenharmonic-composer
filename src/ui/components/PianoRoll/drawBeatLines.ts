import { makeStyle } from '../../makeStyle'
import colors from '../../colors'
import createSVG from '../../createSVG'
import PianoRoll from '../PianoRoll'
import { numToPixel, removeChildren } from '../../../util'

export function drawBeatLines (pianoRoll: PianoRoll): SVGGElement {
  const g = pianoRoll.beatLines
  removeChildren(g)

  const lines = pianoRoll.units * pianoRoll.beatsPerUnit
  for (let i = 0; i < lines; i++) {
    const x = numToPixel(pianoRoll.timeToScreen(i / pianoRoll.beatsPerUnit))
    const line = createSVG('line')
    line.setAttribute('x1', x)
    line.setAttribute('x2', x)
    line.setAttribute('y1', `0`)
    line.setAttribute('y2', `100%`)
    line.classList.add(
        i % pianoRoll.beatsPerUnit === 0 ? unitStyle : beatStyle)
    g.append(line)
  }

  return g
}

const unitStyle = makeStyle({
  stroke: colors.lime[900],
  strokeWidth: `2`,
})

const beatStyle = makeStyle({
  stroke: colors.gray[600],
  strokeDasharray: `2,10`,
  strokeWidth: `1`,
})