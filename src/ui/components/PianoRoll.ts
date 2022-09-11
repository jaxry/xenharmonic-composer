import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'
import { Note } from '../../Note'
import { find, findClosest, lerp, numToPixel } from '../../util'
import {
  insertModulation, Modulation, totalModulationAtTime,
} from '../../modulation'
import createSVG from '../createSVG'
import { drawPianoRollGrid } from './PianoRoll/drawPianoRollGrid'
import PianoRollModulation from './PianoRollModulation'

export default class PianoRoll extends Component {
  svg = createSVG('svg')

  grid = createSVG('g')
  blockContainer = createSVG('g')
  modulationContainer = createSVG('g')

  blocks = new Set<PianoRollBlock>()
  modulationElements = new Set<PianoRollModulation>()

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

    console.log(Math.log2(this.maxFrequency / this.minFrequency))

    this.element.classList.add(containerStyle)

    this.svg.classList.add(svgStyle)
    this.svg.setAttribute('width', numToPixel(this.unitWidth * this.units))
    this.svg.setAttribute('height', numToPixel(this.totalHeight))
    this.svg.style.setProperty('--blockHeight',
        `${Math.round(this.octaveHeight / 18)}px`)
    this.element.append(this.svg)

    this.svg.append(this.grid)
    this.svg.append(this.blockContainer)
    this.svg.append(this.modulationContainer)

    this.addMouseBehavior()

    this.drawGrid()

    setTimeout(() => {
      this.element.scrollTop =
          this.svg.clientHeight / 2 - this.element.clientHeight / 2
    })
  }

  drawGrid () {
    const newGrid = drawPianoRollGrid(this)
    this.grid.replaceWith(newGrid)
    this.grid = newGrid
  }

  mousePosition (
      mouseX: number, mouseY: number, {
        quantizeTimeFn = Math.round,
        openModulation = false,
      } = {}) {
    const { left, bottom, top, height } = this.svg.getBoundingClientRect()

    const time = (mouseX - left) / this.unitWidth
    const timeQuantized = Math.max(0,
        quantizeTimeFn(time * this.beatsPerUnit) / this.beatsPerUnit)

    const x = timeQuantized * this.unitWidth

    const freqLog = lerp(
        bottom, top,
        this.minLogFrequency, this.maxLogFrequency,
        mouseY)
    const freq = Math.exp(freqLog)

    const rootFreq = 440 * totalModulationAtTime(this.modulations,
        timeQuantized - (openModulation ? 1e-10 : 0))

    let octave = Math.floor(Math.log2(freq / rootFreq))

    // number between 1 and 2 representing the unquantized ratio of the
    // note relative to the root frequency
    const ratio = freq / (rootFreq * 2 ** octave)

    let interval = findClosest(scale, ratio, note => note.number)

    // if unquantized pitch is closer to the root note in the octave above,
    // quantize to that root note instead
    if (2 * scale[0].number - ratio < Math.abs(interval.number - ratio)) {
      interval = scale[0]
      octave += 1
    }

    const quantizedFreq = rootFreq * interval.number * 2 ** octave
    const y = lerp(
        this.minLogFrequency, this.maxLogFrequency,
        height, 0,
        Math.log(quantizedFreq))

    return {
      x,
      y,
      time: timeQuantized,
      interval,
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
      if (e.target !== e.currentTarget) {
        return
      }
      if (e.button === 0) {
        this.addNote(e)
      } else if (e.button === 2) {
        this.addModulation(e)
      }
    })
    this.svg.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  }

  private addModulation (e: MouseEvent) {
    const { x, y, time, interval } = this.mousePosition(
        e.clientX, e.clientY, { openModulation: true })

    const modulation = insertModulation(this.modulations, interval, time)

    let modulationElem = find(this.modulationElements,
        (elem) => elem.modulation.time === time)

    if (!modulationElem) {
      modulationElem = this.newComponent(PianoRollModulation, modulation, e)
      this.modulationElements.add(modulationElem)
      this.modulationContainer.append(modulationElem.element)
    }

    modulationElem.setPosition(x, y, this.octaveHeight, this.totalHeight)

    this.drawGrid()
  }

  private addNote (e: MouseEvent) {
    const note = {
      interval: new Fraction(),
      startTime: 0,
      octave: 0,
      duration: 1 / this.beatsPerUnit,
    }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note, e)
    this.blocks.add(block)
    this.blockContainer.append(block.element)

    // TODO: Set default block duration to previously set duration
    block.setWidth(this.unitWidth * note.duration)

    block.onDrag = this.setBlockPosition
    block.onDragEdge = this.setBlockDuration

    // TODO: Don't allow for block overlap. If an existing block exists, replace it
    this.setBlockPosition(block, e.clientX, e.clientY, Math.floor)
  }

  private setBlockPosition = (
      block: PianoRollBlock, mouseX: number, mouseY: number,
      quantizeTimeFn = Math.round) => {

    const { x, y, time, interval, octave } = this.mousePosition(mouseX, mouseY,
        { quantizeTimeFn })

    block.note.startTime = time
    block.note.interval = interval
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
  new Fraction(16, 15),
  new Fraction(9, 8),
  new Fraction(6, 5),
  new Fraction(5, 4),
  new Fraction(4, 3),
  new Fraction(25, 18),
  new Fraction(36, 25),
  new Fraction(3, 2),
  new Fraction(8, 5),
  new Fraction(5, 3),
  new Fraction(9, 5),
  new Fraction(15, 8),
]