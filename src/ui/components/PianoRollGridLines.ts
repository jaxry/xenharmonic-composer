import Component from './Component'
import { makeStyle } from '../makeStyle'
import { backgroundColor } from '../theme'
import { mod } from '../../util'
import Fraction from '../../Fraction'
import { PianoRollTransform } from './PianoRoll'

export default class PianoRollGridLines extends Component {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width = 0
  height = 0

  constructor () {
    super(document.createElement('canvas'))

    this.canvas = this.element as HTMLCanvasElement
    this.canvas.classList.add(canvasStyle)

    this.ctx = this.canvas.getContext('2d')!
  }

  resize () {
    this.width = this.canvas.parentElement!.offsetWidth
    this.height = this.canvas.parentElement!.offsetHeight
    this.canvas.width = this.width * devicePixelRatio
    this.canvas.height = this.height * devicePixelRatio
    this.ctx.scale(devicePixelRatio, devicePixelRatio)

    // move coordinate origin to bottom left to mimic cartesian coords
    this.ctx.translate(0, this.height)
    this.ctx.scale(1, -1)
  }

  draw (
      beatsPerUnit: number, scale: Fraction[], transform: PianoRollTransform) {
    this.resize()

    const w = this.width
    const h = this.height

    // draw beat (sub-unit) lines
    const beatCount = transform.spanX * beatsPerUnit
    this.ctx.beginPath()
    for (let i = 0; i < beatCount; i++) {
      const x = (i / beatCount +
          mod(-transform.translationX, 1 / beatsPerUnit) / transform.spanX) * w
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, h)
    }
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = backgroundColor['700']
    this.ctx.stroke()

    // draw time unit lines
    const unitCount = transform.spanX
    this.ctx.beginPath()
    for (let i = 0; i < unitCount; i++) {
      const x = (i / unitCount +
          mod(-transform.translationX, 1) / transform.spanX) * w
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, h)
    }
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = backgroundColor['600']
    this.ctx.stroke()

    // draw pitch lines
    this.ctx.beginPath()
    for (let offset = -1; offset < transform.spanY; offset++) {
      for (const pitch of scale) {
        const y = (offset + Math.log2(pitch.number) +
            mod(-transform.translationY, 1)) / transform.spanY * h
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(w, y)
      }
    }
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = backgroundColor['700']
    this.ctx.stroke()

    // draw octave lines
    this.ctx.beginPath()
    const octaveCount = transform.spanY
    for (let i = 0; i <= octaveCount; i++) {
      const y = (i / octaveCount +
          mod(-transform.translationY, 1) / transform.spanY) * h
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(w, y)
    }
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = backgroundColor['500']
    this.ctx.stroke()
  }
}

const canvasStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  left: `0`,
  width: `100%`,
  height: `100%`,
  zIndex: `-1`,
})
