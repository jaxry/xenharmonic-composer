import { makeStyle } from '../../makeStyle'
import colors from '../../colors'
import createSVG from '../../createSVG'
import PianoRoll from '../PianoRoll'
import { numToPixel } from '../../../util'
import { modulateByInterval } from '../../../modulation'

export function drawPitchLines (pianoRoll: PianoRoll): SVGGElement {
  const g = createSVG('g')

  let rootFreq = 440
  let currentTime = 0

  for (const modulation of pianoRoll.modulations) {
    addPitches(rootFreq, currentTime, modulation.time)
    rootFreq = modulateByInterval(rootFreq, modulation.interval)
    currentTime = modulation.time
  }

  addPitches(rootFreq, currentTime)

  function addPitches (rootFreq: number, fromTime: number, toTime?: number) {
    const startFreq = rootFreq *
        2 ** (Math.floor(Math.log2(pianoRoll.minFrequency / rootFreq)))

    for (let f = startFreq; f <= pianoRoll.maxFrequency; f *= 2) {
      for (const pitch of pianoRoll.scale) {
        const freq = f * pitch.number

        const x1 = numToPixel(pianoRoll.timeToScreen(fromTime))
        const x2 = toTime ?
            numToPixel(pianoRoll.timeToScreen(toTime)) :
            `100%`
        const y = numToPixel(pianoRoll.frequencyToScreen(freq))

        const line = createSVG('line')
        line.setAttribute('x1', x1)
        line.setAttribute('x2', x2)
        line.setAttribute('y1', y)
        line.setAttribute('y2', y)
        line.classList.add(pitch.number === 1 ? octaveStyle : pitchStyle)
        g.append(line)
      }
    }
  }

  return g
}

const octaveStyle = makeStyle({
  stroke: colors.sky[600],
  strokeWidth: `2`,
})

const pitchStyle = makeStyle({
  stroke: colors.slate[700],
  strokeWidth: `1`,
})