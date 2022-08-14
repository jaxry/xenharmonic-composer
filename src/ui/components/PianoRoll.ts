import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import PianoRollGrid from './PianoRollGrid'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'
import { lerp } from '../../util'
import { Note } from '../../Note'

export default class PianoRoll extends Component {
  grid: PianoRollGrid

  content = document.createElement('div')
  blocks = new Set<PianoRollBlock>()

  units = 8
  beatsPerUnit = 4

  unitWidth = 200
  height = 2500

  minFrequency = 30
  maxFrequency = 10030

  minLogFrequency = Math.log(this.minFrequency)
  maxLogFrequency = Math.log(this.maxFrequency)

  scale = scale

  constructor (public notes: Set<Note>) {
    super()

    this.element.classList.add(containerStyle)

    this.content.classList.add(contentStyle)
    this.element.append(this.content)

    this.grid = this.newComponent(PianoRollGrid,
        scale,
        this.minFrequency, this.maxFrequency,
        this.units, this.beatsPerUnit)

    this.content.append(this.grid.element)

    this.addMouseBehavior()

    this.content.style.height = `${this.height}px`
    this.content.style.width = `${this.unitWidth * this.units}px`

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
        }, (e) => {
          if (e.button !== 1) {
            return false
          }
        })

    this.content.addEventListener('pointerdown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      this.addNote(e.clientX, e.clientY)
    })
  }

  private addNote (x: number, y: number) {
    const note = { pitch: new Fraction(), time: 0, octave: 0 }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note)
    this.blocks.add(block)
    this.content.append(block.element)

    // block.onDrag = (mouseX: number, mouseY: number) => {
    //   this.setBlockPosition(block, mouseX, mouseY)
    // }
    //
    this.setBlockPosition(block, x, y)
  }

  private setBlockPosition (
      block: PianoRollBlock, mouseX: number, mouseY: number) {
    const { left, right, bottom, top, height } = this.content.getBoundingClientRect()

    const time = (mouseX - left) / this.unitWidth
    const timeQuantized = Math.floor(time * this.beatsPerUnit) / this.beatsPerUnit
    const x = timeQuantized * this.unitWidth

    const freqLog = lerp(
        bottom, top,
        this.minLogFrequency, this.maxLogFrequency,
        mouseY)
    const freq = Math.exp(freqLog)

    const rootFreq = 440
    let octave = Math.floor(Math.log2(freq / rootFreq))

    // number between 1 and 2 representing an unquantized pitch in the scale
    const pitch = freq / (rootFreq * 2 ** octave)

    let scalePitch = findClosest(scale, pitch, note => note.number)

    // if unquantized pitch is closer to the root note in the above octave,
    // quantize to that root note instead
    if (2 - pitch < Math.abs(scalePitch.number - pitch)) {
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
    block.note.time = timeQuantized
    block.setPosition(x, y)
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

function findClosest<T> (
    array: T[], target: number, iteratee: (elem: T) => number) {
  return array.reduce((closest, value) => {
    const distance = Math.abs(iteratee(value) - target)
    if (distance < closest.distance) {
      closest.distance = distance
      closest.value = value
    }
    return closest
  }, { value: array[0], distance: Infinity }).value
}