import Component from './Component'
import { makeStyle } from '../makeStyle'
import { backgroundColor } from '../theme'
import Fraction from '../../Fraction'
import createSVG from '../createSVG'
import colors from '../colors'
import { lerp } from '../../util'

export default class PianoRollGrid extends Component {
  svg = createSVG('svg')
  lines = createSVG('g')

  constructor (public scale: Fraction[], public minFrequency: number, public maxFrequency: number) {
    super()

    this.element = this.svg as any
    this.svg.classList.add(svgStyle)
    this.svg.setAttribute('width', `100%`)
    this.svg.setAttribute('height', `100%`)
    this.svg.setAttribute('preserveAspectRatio', `none`)

    this.svg.setAttribute(`viewBox`, `0 0 8 100`)

    this.svg.append(this.lines)

    const minLogFrequency = Math.log(minFrequency)
    const maxLogFrequency = Math.log(maxFrequency)

    const rootFreq = 440
    const startFreq = rootFreq * 2 ** (Math.floor(Math.log2(minFrequency / rootFreq)))

    for (let f = startFreq; f <= maxFrequency; f *= 2) {
      for (const pitch of scale) {
        const freq = f * pitch.number
        const y = lerp(minLogFrequency, maxLogFrequency, 100, 0, Math.log(freq))
        const line = createSVG('line')
        line.setAttribute('x1', `0`)
        line.setAttribute('y1', y.toString())
        line.setAttribute('x2', `99`)
        line.setAttribute('y2', y.toString())
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
  transformBox: `fill-box`
})

const nonScaling = {
  // @ts-ignore
  vectorEffect: `non-scaling-stroke`
}

const octaveStyle = makeStyle({
  stroke: colors.sky[600],
  strokeWidth: `2`,
  ...nonScaling
})

const pitchStyle = makeStyle({
  stroke: colors.zinc[600],
  strokeWidth: `1`,
  ...nonScaling
})