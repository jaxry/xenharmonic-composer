import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import Fraction from '../../Fraction'
import { Note } from '../../Note'
import { lerp, numToPixel } from '../../util'
import { Modulation, totalModulationAtTime } from '../../modulation'
import createSVG from '../createSVG'
import PianoRollModulation from './PianoRollModulation'
import { frequencyToPitch, scale } from '../../scale'
import { drawPitchLines } from './PianoRoll/drawPitchLines'
import { drawBeatLines } from './PianoRoll/drawBeatLines'
import { previewNote } from '../../playNotes'
import { deleteBlockBehavior } from './PianoRoll/deleteBlockBehavior'
import { panBehavior } from './PianoRoll/panBehavior'
import { keyPressBehavior } from './PianoRoll/keyPressBehavior'

/* TODO: New controls
  Have a bar at the bottom that clicking creates a modulation that you can drag around
  Modulations don't round. Creating a modulation starts at root, and user can move it up or down without limit
*/
export default class PianoRoll extends Component {
  gridContainer = document.createElement('div')
  grid = createSVG('svg')

  lines = createSVG('g')
  beatLines = createSVG('g')
  pitchLines = createSVG('g')
  blockContainer = createSVG('g')
  modulationContainer = createSVG('g')

  blockElementToBlock = new WeakMap<Element, PianoRollBlock>()
  modulationElements = new Set<PianoRollModulation>()

  units = 16
  beatsPerUnit = 4

  // change these for user zoom controls
  unitWidth = 200
  octaveHeight = 350

  minFrequency = 30
  maxFrequency = 5000
  readonly minLogFrequency = Math.log(this.minFrequency)
  readonly maxLogFrequency = Math.log(this.maxFrequency)

  readonly width = this.unitWidth * this.units
  readonly height = Math.round(
      this.octaveHeight * Math.log2(this.maxFrequency / this.minFrequency))

  scale = scale

  constructor (public notes: Set<Note>, public modulations: Modulation[]) {
    super()

    this.element.classList.add(containerStyle)

    this.gridContainer.classList.add(gridContainerStyle)
    this.element.append(this.gridContainer)

    this.grid.classList.add(svgStyle)
    this.grid.setAttribute('width', numToPixel(this.width))
    this.grid.setAttribute('height', numToPixel(this.height))
    this.grid.style.setProperty('--blockHeight',
        `${Math.round(this.octaveHeight / 18)}px`)
    this.gridContainer.append(this.grid)

    this.lines.classList.add(linesStyle)
    this.lines.append(this.pitchLines)
    this.lines.append(this.beatLines)
    this.grid.append(this.lines)

    this.grid.append(this.blockContainer)
    this.grid.append(this.modulationContainer)

    this.addMouseBehavior()
    panBehavior(this)
    deleteBlockBehavior(this)
    keyPressBehavior(this)

    drawPitchLines(this)
    drawBeatLines(this)

    setTimeout(() => {
      this.gridContainer.scrollTop =
          this.grid.clientHeight / 2 - this.gridContainer.clientHeight / 2
    })
  }

  mouseToNote (
      mouseX: number, mouseY: number, {
        quantizeTimeFn = Math.round,
        openModulation = false,
      } = {}) {
    const { left, bottom, top } = this.grid.getBoundingClientRect()
    const time = (mouseX - left) / this.unitWidth

    const timeQuantized = Math.max(0,
        quantizeTimeFn(time * this.beatsPerUnit) / this.beatsPerUnit)

    const freqLog = lerp(
        bottom, top,
        this.minLogFrequency, this.maxLogFrequency,
        mouseY)
    const freq = Math.exp(freqLog)

    const rootFreq = 440 * totalModulationAtTime(this.modulations,
        timeQuantized - (openModulation ? 1e-10 : 0))

    const { interval, octave } = frequencyToPitch(this.scale, rootFreq, freq)

    return {
      time: timeQuantized,
      interval,
      octave,
      frequency: rootFreq * interval.number * 2 ** octave,
    }
  }

  timeToScreen (time: number) {
    return time * this.unitWidth
  }

  frequencyToScreen (freq: number) {
    return lerp(
        this.minLogFrequency, this.maxLogFrequency,
        this.height, 0,
        Math.log(freq))
  }

  deleteBlock (block: PianoRollBlock) {
    this.notes.delete(block.note)
    block.element.remove()
  }

  private addMouseBehavior () {
    this.grid.addEventListener('mousedown', (e) => {
      if (e.target !== e.currentTarget) {
        return
      }
      if (e.button === 0) {
        this.addNote(e)
      }
    })

    // prevent browser's default right click menu
    this.grid.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  }

  // TODO: move to PianoRoll folder
  private addNote (e: MouseEvent) {
    const note = {
      interval: new Fraction(),
      startTime: 0,
      octave: 0,
      duration: 1 / this.beatsPerUnit,
    }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note, e)
    this.blockContainer.append(block.element)

    // TODO: Set default block duration to previously set duration
    block.setWidth(this.unitWidth * note.duration)

    block.onDrag = this.setBlockPosition
    block.onDragEdge = this.setBlockDuration

    // TODO: Don't allow for block overlap. If an existing block exists, replace it
    this.setBlockPosition(block, e.clientX, e.clientY, Math.floor)

    this.blockElementToBlock.set(block.element, block)
  }

  private setBlockPosition = (
      block: PianoRollBlock, mouseX: number, mouseY: number,
      quantizeTimeFn = Math.round) => {

    const { time, interval, octave, frequency } = this.mouseToNote(
        mouseX, mouseY, { quantizeTimeFn })

    const isNoteChanged =
        interval !== block.note.interval ||
        octave !== block.note.octave

    block.note.startTime = time
    block.note.interval = interval
    block.note.octave = octave

    if (isNoteChanged) {
      previewNote(block.note, this.modulations)
    }

    const x = this.timeToScreen(time)
    const y = this.frequencyToScreen(frequency)
    block.setPosition(x, y)
  }

  private setBlockDuration = (block: PianoRollBlock, mouseX: number) => {
    const { left } = this.grid.getBoundingClientRect()
    const endTime = (mouseX - left) / this.unitWidth
    const endTimeQuantized = Math.round(endTime * this.beatsPerUnit) /
        this.beatsPerUnit

    const startTime = block.note.startTime
    const duration = endTimeQuantized - startTime
    if (duration > 0) {
      const width = (endTimeQuantized - startTime) * this.unitWidth
      block.note.duration = duration
      block.setWidth(width)
    }
  }
}

const containerStyle = makeStyle({
  position: `relative`,
  margin: `1rem`,
  height: `50rem`,
  border,
  borderRadius,
  userSelect: `none`,
})

const gridContainerStyle = makeStyle({
  overflow: `scroll`,
  height: `100%`,
})

const svgStyle = makeStyle({
  transformOrigin: `top left`,
  contain: `strict`,
})

const linesStyle = makeStyle({
  pointerEvents: `none`,
})

// makes transform behave relative to each object (like with CSS)
// instead of relative to the svg's viewBox
makeStyle(`.${svgStyle} *`, {
  transformBox: `fill-box`,
})