import Component from './Component'
import { makeStyle } from '../makeStyle'
import createSVG from '../createSVG'
import colors from '../colors'
import { lerp } from '../../util'
import PianoRoll from './PianoRoll'

export default class PianoRollGrid extends Component {
  svg = createSVG('svg')
  lines = createSVG('g')

  constructor (private pianoRoll: PianoRoll) {
    super()

    this.element = this.svg as any
    this.svg.classList.add(svgStyle)
    this.svg.setAttribute('width', `100%`)
    this.svg.setAttribute('height', `100%`)
    this.svg.setAttribute('preserveAspectRatio', `none`)

    this.svg.setAttribute(`viewBox`, `0 0 8 1`)

    this.svg.append(this.lines)

    let rootFreq = 440
    let currentTime = 0

    for (const modulation of pianoRoll.modulations) {
      this.addPitches(rootFreq, currentTime, modulation.time)
      rootFreq *= modulation.interval.number
      currentTime = modulation.time
    }

    this.addPitches(rootFreq, currentTime)

    const lines = pianoRoll.units * pianoRoll.beatsPerUnit
    for (let i = 0; i < lines; i++) {
      const x = (i / pianoRoll.beatsPerUnit).toString()
      const line = createSVG('line')
      line.setAttribute('x1', x)
      line.setAttribute('x2', x)
      line.setAttribute('y1', `0`)
      line.setAttribute('y2', `1`)
      line.classList.add(i % pianoRoll.beatsPerUnit === 0 ? unitStyle : beatStyle)
      this.lines.append(line)
    }
  }

  private addPitches(rootFreq: number, fromTime: number, toTime?: number) {
    const startFreq = rootFreq * 2 **
        (Math.floor(Math.log2(this.pianoRoll.minFrequency / rootFreq)))

    for (let f = startFreq; f <= this.pianoRoll.maxFrequency; f *= 2) {
      for (const pitch of this.pianoRoll.scale) {
        const freq = f * pitch.number

        const y = lerp(
            this.pianoRoll.minLogFrequency, this.pianoRoll.maxLogFrequency,
            1, 0, Math.log(freq)).toString()

        const line = createSVG('line')
        line.setAttribute('x1', fromTime.toString())
        line.setAttribute('x2', toTime ? toTime.toString() : `100%`)
        line.setAttribute('y1', y)
        line.setAttribute('y2', y)
        line.classList.add(pitch.number === 1 ? octaveStyle : pitchStyle)
        this.lines.append(line)
      }
    }
  }

}

const svgStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  left: `0`,
  zIndex: `-1`,
  pointerEvents: `none`,
  transformOrigin: `top left`,
  contain: `strict`,
})

// makes transform behave relative to each object (like with CSS)
// instead of relative to the svg's viewBox
makeStyle(`.${svgStyle} *`, {
  transformBox: `fill-box`,
})

const nonScaling = {
  // @ts-ignore
  vectorEffect: `non-scaling-stroke`,
}

const octaveStyle = makeStyle({
  ...nonScaling,
  stroke: colors.sky[600],
  strokeWidth: `2`,
})

const pitchStyle = makeStyle({
  ...nonScaling,
  stroke: colors.slate[700],
  strokeWidth: `1`,
})

const unitStyle = makeStyle({
  ...nonScaling,
  stroke: colors.lime[900],
  strokeWidth: `2`,
})

const beatStyle = makeStyle({
  ...nonScaling,
  stroke: colors.gray[600],
  strokeDasharray: `2,10`,
  strokeWidth: `1`,
})