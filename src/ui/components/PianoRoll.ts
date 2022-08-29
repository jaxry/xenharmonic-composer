import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'
import { Note } from '../../Note'
import { findClosest, lerp, numToPixel } from '../../util'
import { Modulation, totalModulationAtTime } from '../../modulation'
import createSVG from '../createSVG'
import { drawPianoRollGrid } from './PianoRoll/drawPianoRollGrid'

export default class PianoRoll extends Component {
  svg = createSVG('svg')

  grid: SVGGElement

  blocks = new Set<PianoRollBlock>()

  units = 8
  beatsPerUnit = 4

  // change these for user zoom controls
  unitWidth = 200
  octaveHeight = 350

  minFrequency = 30
  maxFrequency = 5000
  readonly minLogFrequency = Math.log(this.minFrequency)
  readonly maxLogFrequency = Math.log(this.maxFrequency)

  readonly totalHeight = Math.round(
      this.octaveHeight * Math.log2(this.maxFrequency / this.minFrequency))

  scale = scale

  constructor (public notes: Set<Note>, public modulations: Modulation[]) {
    super()

    this.element.classList.add(containerStyle)

    this.svg.classList.add(svgStyle)
    this.svg.setAttribute('width', numToPixel(this.unitWidth * this.units))
    this.svg.setAttribute('height', numToPixel(this.totalHeight))
    this.svg.style.setProperty('--blockHeight',
        `${Math.round(this.octaveHeight / 18)}px`)
    this.element.append(this.svg)

    this.modulations.push({
      time: 2,
      interval: this.scale[1],
    }, {
      time: 3,
      interval: this.scale[1],
    })

    this.grid = drawPianoRollGrid(this)
    this.svg.append(this.grid)

    this.addMouseBehavior()

    setTimeout(() => {
      this.element.scrollTop =
          this.svg.clientHeight / 2 - this.element.clientHeight / 2
    })
  }

  mousePosition (mouseX: number, mouseY: number, quantizeTimeFn = Math.round) {
    const { left, bottom, top, height } = this.svg.getBoundingClientRect()

    const time = (mouseX - left) / this.unitWidth
    const timeQuantized = quantizeTimeFn(time * this.beatsPerUnit) /
        this.beatsPerUnit
    const x = timeQuantized * this.unitWidth

    const freqLog = lerp(
        bottom, top,
        this.minLogFrequency, this.maxLogFrequency,
        mouseY)
    const freq = Math.exp(freqLog)

    const rootFreq = 440 *
        totalModulationAtTime(this.modulations, timeQuantized)

    let octave = Math.floor(Math.log2(freq / rootFreq))

    // number between 1 and 2 representing an unquantized pitch in the scale
    const pitch = freq / (rootFreq * 2 ** octave)

    let scalePitch = findClosest(scale, pitch, note => note.number)

    // if unquantized pitch is closer to the root note in the above octave,
    // quantize to that root note instead
    if (2 * scale[0].number - pitch < Math.abs(scalePitch.number - pitch)) {
      scalePitch = scale[0]
      octave += 1
    }

    const quantizedFreq = rootFreq * scalePitch.number * 2 ** octave
    const y = lerp(
        this.minLogFrequency, this.maxLogFrequency,
        height, 0,
        Math.log(quantizedFreq))

    return {
      x,
      time: timeQuantized,
      y,
      frequency: quantizedFreq,
      pitch: scalePitch,
      octave,
    }

  }

  private addMouseBehavior () {
    makeDraggable(this.element,
        (e, mx, my) => {
          this.element.scrollLeft -= mx
          this.element.scrollTop -= my
        }, {
          enableWhen: (e) => e.button === 1,
        })

    this.svg.addEventListener('mousedown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      if (e.ctrlKey) {
        this.addModulation(e)
      } else {
        this.addNote(e)
      }
    })
  }

  private addModulation (e: MouseEvent) {
    const { x, time, y, pitch, octave } = this.mousePosition(e.clientX,
        e.clientY)
  }

  private addNote (e: MouseEvent) {
    const note = {
      pitch: new Fraction(),
      startTime: 0,
      octave: 0,
      duration: 1 / this.beatsPerUnit,
    }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note, e)
    this.blocks.add(block)
    this.svg.append(block.element)

    block.setWidth(this.unitWidth * note.duration)

    block.onDrag = this.setBlockPosition
    block.onDragEdge = this.setBlockDuration

    this.setBlockPosition(block, e.clientX, e.clientY, Math.floor)
  }

  private setBlockPosition = (
      block: PianoRollBlock, mouseX: number, mouseY: number,
      quantizeTimeFn = Math.round) => {

    const { x, time, y, pitch, octave } = this.mousePosition(mouseX, mouseY,
        quantizeTimeFn)

    block.note.startTime = time
    block.note.pitch = pitch
    block.note.octave = octave
    block.setPosition(x, y)
  }

  private setBlockDuration = (block: PianoRollBlock, mouseX: number) => {
    const { left } = this.svg.getBoundingClientRect()
    const endTime = (mouseX - left) / this.unitWidth
    const endTimeQuantized = Math.round(endTime * this.beatsPerUnit) /
        this.beatsPerUnit

    const startTime = block.note.startTime
    const duration = endTimeQuantized - startTime
    if (duration !== 0) {
      const width = (endTimeQuantized - startTime) * this.unitWidth
      block.note.duration = duration
      block.setWidth(width)
    }
  }
}

const containerStyle = makeStyle({
  margin: `1rem`,
  height: `40rem`,
  border,
  borderRadius,
  userSelect: `none`,
  overflow: `auto`,
  contain: `strict`,
})

const svgStyle = makeStyle({
  transformOrigin: `top left`,
  contain: `strict`,
})

// makes transform behave relative to each object (like with CSS)
// instead of relative to the svg's viewBox
makeStyle(`.${svgStyle} *`, {
  transformBox: `fill-box`,
})

const scale = [
  new Fraction(1, 1),
  new Fraction(15, 14),
  new Fraction(8, 7),
  new Fraction(6, 5),
  new Fraction(5, 4),
  new Fraction(4, 3),
  new Fraction(7, 5),
  new Fraction(10, 7),
  new Fraction(3, 2),
  new Fraction(8, 5),
  new Fraction(5, 3),
  new Fraction(7, 4),
  new Fraction(15, 8),
]

