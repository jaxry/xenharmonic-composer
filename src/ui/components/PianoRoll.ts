import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import PianoRollGrid from './PianoRollGrid'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'
import { Note } from '../../Note'
import { lerp } from '../../math'
import { findClosest } from '../../util'
import { Modulation, totalModulationAtTime } from '../../modulation'

export default class PianoRoll extends Component {
  content = document.createElement('div')
  blocks = new Set<PianoRollBlock>()

  units = 8
  beatsPerUnit = 4

  // change these for user zoom controls
  unitWidth = 200
  octaveHeight = 350

  minFrequency = 30
  maxFrequency = 5000
  minLogFrequency = Math.log(this.minFrequency)
  maxLogFrequency = Math.log(this.maxFrequency)

  scale = scale

  grid: PianoRollGrid

  constructor (public notes: Set<Note>, public modulations: Modulation[]) {
    super()

    this.element.classList.add(containerStyle)

    this.content.classList.add(contentStyle)
    this.element.append(this.content)

    this.modulations.push({
      time: 2,
      interval: this.scale[1],
    }, {
      time: 3,
      interval: this.scale[1],
    })

    this.grid = this.newComponent(PianoRollGrid, this)

    this.content.append(this.grid.element)

    this.addMouseBehavior()

    const totalHeight = this.octaveHeight *
        Math.log2(this.maxFrequency / this.minFrequency)
    this.content.style.height = `${Math.round(totalHeight)}px`
    this.content.style.width = `${this.unitWidth * this.units}px`
    this.content.style.setProperty('--blockHeight',
        `${Math.round(this.octaveHeight / 18)}px`)

    setTimeout(() => {
      // this.grid.setZoom(this.zoomX, this.zoomY, this.padding)
      this.element.scrollTop =
          this.content.offsetHeight / 2 - this.element.offsetHeight / 2
    })
  }

  private addMouseBehavior () {
    makeDraggable(this.element,
        (e, mx, my) => {
          this.element.scrollLeft -= mx
          this.element.scrollTop -= my
        }, {
          enableWhen: (e) => e.button === 1,
        })

    this.content.addEventListener('pointerdown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      this.addNote(e)
    })
  }

  private addNote (e: PointerEvent) {
    const note = {
      pitch: new Fraction(),
      startTime: 0,
      octave: 0,
      duration: 1 / this.beatsPerUnit,
    }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note, e)
    this.blocks.add(block)
    this.content.append(block.element)

    block.setWidth(this.unitWidth * note.duration)

    block.onDrag = this.setBlockPosition
    block.onDragEdge = this.setBlockTime

    this.setBlockPosition(block, e.clientX, e.clientY, Math.floor)
  }

  private setBlockPosition = (
      block: PianoRollBlock, mouseX: number, mouseY: number,
      quantizeTimeFn = Math.round) => {
    const { left, bottom, top, height } = this.content.getBoundingClientRect()

    const time = (mouseX - left) / this.unitWidth
    const timeQuantized = quantizeTimeFn(time * this.beatsPerUnit) /
        this.beatsPerUnit
    const x = timeQuantized * this.unitWidth
    block.note.startTime = timeQuantized

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

    block.note.pitch = scalePitch
    block.note.octave = octave

    block.setPosition(x, y)
  }

  private setBlockTime = (block: PianoRollBlock, mouseX: number) => {
    const { left } = this.content.getBoundingClientRect()
    const endTime = (mouseX - left) / this.unitWidth
    const endTimeQuantized = Math.round(endTime * this.beatsPerUnit) /
        this.beatsPerUnit

    const startTime = block.note.startTime

    if (endTimeQuantized - startTime !== 0) {
      const width = (endTimeQuantized - startTime) * this.unitWidth
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

const contentStyle = makeStyle({
  position: `relative`,
  contain: `strict`,
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

