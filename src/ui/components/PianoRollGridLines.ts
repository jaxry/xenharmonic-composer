import Component from './Component'
import { makeStyle } from '../makeStyle'
import { backgroundColor } from '../theme'
import { mod } from '../../util'
import getScaleAndTranslation from '../getScaleAndTranslation'
import Fraction from '../../Fraction'

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
  }

  draw (beatsPerUnit: number, scale: Fraction[], transform: DOMMatrix) {
    this.resize()

    const w = this.width
    const h = this.height

    const { tx, ty, sx, sy } = getScaleAndTranslation(transform)

    // draw time beat (sub-unit) lines
    const beatCount = beatsPerUnit / sx

    this.ctx.beginPath()
    for (let i = 0; i <= beatCount; i++) {
      const x = i / beatCount * w + mod(tx, w / beatCount)
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, h)
    }
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = backgroundColor['700']
    this.ctx.stroke()

    // draw time unit lines
    const unitCount = 1 / sx
    this.ctx.beginPath()
    for (let i = 0; i <= unitCount; i++) {
      const x = i / unitCount * w + mod(tx, w / unitCount)
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, h)
    }
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = backgroundColor['600']
    this.ctx.stroke()

    // draw pitch lines

    // the y position of the highest root note of the top octave
    const start = Math.ceil(ty / h / sy)

    // the y position of the bottom of the canvas
    const to = (ty - h) / h / sy

    for (let offset = start; offset > to; offset--) {
      this.ctx.beginPath()
      const pitchCount = scale.length
      for (let i = 0; i < pitchCount; i++) {
        const y = (1 - (Math.log2(scale[i].number) + offset)) * sy * h + ty
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(w, y)
      }
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = backgroundColor['700']
      this.ctx.stroke()
    }

    // draw octave lines
    this.ctx.beginPath()
    const octaveCount = 1 / sy
    for (let i = 0; i <= octaveCount; i++) {
      const y = i / octaveCount * h + mod(ty, h / octaveCount)
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
