import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import PianoRollGridLines from './PianoRollGridLines'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'

export default class PianoRoll extends Component {
  gridLines: PianoRollGridLines

  blockContainer = document.createElement('div')
  blocks = new Set<PianoRollBlock>()

  beatsPerUnit = 4

  // x-axis distance of one contains this.beatsPerUnit time steps
  // y-axis distance of one spans one octave of pitch
  transform: PianoRollTransform = {
    translationX: 0,
    translationY: 0,
    spanX: 4,
    spanY: 1.5,
  }

  scale = scale

  constructor (public notes: Set<Note>) {
    super()

    this.element.classList.add(containerStyle)

    this.blockContainer.classList.add(blockContainerStyle)
    this.element.append(this.blockContainer)

    this.gridLines = this.newComponent(PianoRollGridLines)
    this.element.append(this.gridLines.element)

    this.addMouseBehavior()

    setTimeout(() => {
      this.drawGrid()
    })
  }

  private addMouseBehavior () {
    let rect: DOMRect
    this.onRemove(makeDraggable(
        this.element,
        (e, mx, my) => {
          this.transform.translationX -= this.transform.spanX * mx / rect.width
          this.transform.translationY += this.transform.spanY * my / rect.height
          this.drawGrid()
        }, (e) => {
          if (e.button !== 1) {
            return false
          }
          rect = this.element.getBoundingClientRect()
        }))

    this.element.addEventListener('wheel', (e) => {
      e.preventDefault()

      const amount = 1.10
      const change = Math.sign(e.deltaY) > 0 ? amount : 1 / amount

      const { left, width } = this.element.getBoundingClientRect()

      const mx = (e.clientX - left) / width

      // the mouse position should point to the same location in the model before and after the scale
      // old mouse-model position = new mouse-model position =>
      // oldTranslation + mouse * oldSpan = newTranslation + mouse * newSpan
      // solve for newTranslation
      this.transform.translationX += mx * this.transform.spanX * (1 - change)
      this.transform.spanX *= change

      // this.transform.spanY *= change
      this.drawGrid()
    })

    this.element.addEventListener('pointerdown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      this.addNote(e.clientX, e.clientY)
    })
  }

  private drawGrid () {
    this.gridLines.draw(this.beatsPerUnit, this.scale, this.transform)
    this.updateBlockPositions()
  }

  private addNote (x: number, y: number) {
    const note = { pitch: 1, time: 0 }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note)
    this.blocks.add(block)
    this.blockContainer.append(block.element)

    block.onDrag = (mouseX: number, mouseY: number) => {
      this.setBlockPosition(block, mouseX, mouseY)
    }

    this.setBlockPosition(block, x, y)
  }

  private setBlockPosition (
      block: PianoRollBlock, mouseX: number, mouseY: number) {
    const { left, width, bottom, height } = this.element.getBoundingClientRect()

    const time = this.transform.translationX +
        (mouseX - left) / width * this.transform.spanX

    const quantizedTime = Math.round(time * this.beatsPerUnit) /
        this.beatsPerUnit

    block.note.time = quantizedTime
    const x = (quantizedTime - this.transform.translationX) /
        this.transform.spanX * width

    const logPitch = this.transform.translationY +
        (bottom - mouseY) / height * this.transform.spanY

    const octave = Math.floor(logPitch)

    const quantizedRelativePitch = closest(
        this.scale,
        2 ** (logPitch - octave),
        (pitch) => pitch.number)

    const quantizedPitch = (2 ** octave) * quantizedRelativePitch.number

    block.note.pitch = quantizedPitch

    const y = height -
        ((Math.log2(quantizedPitch) - this.transform.translationY) /
            this.transform.spanY * height)

    block.setPosition(x, y)
  }

  private updateBlockPositions () {
    // const { width, height } = this.element.getBoundingClientRect()
    // const { tx, ty, sx, sy } = getScaleAndTranslation(this.transform)
    //
    // for (const block of this.blocks) {
    //   const x = block.note.time * sx * width + tx
    //   const y = ty - Math.log2(block.note.pitch) * sy * height
    //   block.setPosition(x, y)
    // }
  }
}

const containerStyle = makeStyle({
  position: `relative`,
  overflow: `hidden`,
  margin: `1rem`,
  height: `30rem`,
  border,
  borderRadius,
  userSelect: `none`,
})

const blockContainerStyle = makeStyle({
  transformOrigin: `bottom left`,
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

export interface PianoRollTransform {
  translationX: number,
  translationY: number,
  spanX: number,
  spanY: number
}

function closest<T> (
    array: T[], target: number, iteratee: (elem: T) => number): T {
  return array.reduce((closest, value) => {
    const distance = Math.abs(iteratee(value) - target)
    if (distance < closest.distance) {
      closest.distance = distance
      closest.value = value
    }
    return closest
  }, { value: array[0], distance: Infinity }).value
}