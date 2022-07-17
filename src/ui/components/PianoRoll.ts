import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import PianoRollGrid from './PianoRollGrid'
import Fraction from '../../Fraction'
import makeDraggable from '../makeDraggable'
import { clamp, lerp } from '../../util'

export default class PianoRoll extends Component {
  grid: PianoRollGrid

  content = document.createElement('div')
  blocks = new Set<PianoRollBlock>()

  beatsPerUnit = 4

  zoomX = 200
  zoomY = 2500
  padding = 24

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

    this.grid = this.newComponent(PianoRollGrid, scale, this.minFrequency, this.maxFrequency)
    this.content.append(this.grid.element)

    this.addMouseBehavior()

    this.content.style.height = `${this.zoomY}px`
    this.content.style.width = `${this.zoomX * 8}px`

    setTimeout(() => {
      // this.grid.setZoom(this.zoomX, this.zoomY, this.padding)
    })
  }

  private addMouseBehavior () {
    let rect: DOMRect
    // this.onRemove(makeDraggable(
    //     this.element,
    //     (e, mx, my) => {
    //       this.transform.translationX -= this.transform.spanX * mx / rect.width
    //       this.transform.translationY += this.transform.spanY * my / rect.height
    //       this.drawPianoRoll()
    //     }, (e) => {
    //       if (e.button !== 1) {
    //         return false
    //       }
    //       rect = this.element.getBoundingClientRect()
    //     }))

    // this.element.addEventListener('wheel', (e) => {
    //   e.preventDefault()
    //
    //   const amount = 1.10
    //   const change = Math.sign(e.deltaY) > 0 ? amount : 1 / amount
    //
    //   const { left, width } = this.element.getBoundingClientRect()
    //
    //   const mx = (e.clientX - left) / width
    //
    //   // the mouse position should point to the same location in the model before and after the scale
    //   // oldTranslation + oldSpan * mouse = newTranslation + newSpan * mouse
    //   // solve for newTranslation
    //   this.transform.translationX += mx * this.transform.spanX * (1 - change)
    //   this.transform.spanX *= change
    //
    //   this.drawPianoRoll()
    // })

    this.content.addEventListener('pointerdown', (e) => {
      // if (e.target !== e.currentTarget || e.button !== 0) {
      //   return
      // }
      // this.addNote(e.clientX, e.clientY)
      const rect = this.content.getBoundingClientRect()
      const freqLog = lerp(rect.bottom, rect.top, this.minLogFrequency, this.maxLogFrequency, e.clientY)
      const freq = Math.exp(freqLog)
      console.log(freq)
    })
  }

  private addNote (x: number, y: number) {
    const note = { pitch: 1, time: 0 }
    this.notes.add(note)

    const block = this.newComponent(PianoRollBlock, note)
    this.blocks.add(block)
    this.content.append(block.element)

    // block.onDrag = (mouseX: number, mouseY: number) => {
    //   this.setBlockPosition(block, mouseX, mouseY)
    // }
    //
    // this.setBlockPosition(block, x, y)
  }

  // private setBlockPosition (
  //     block: PianoRollBlock, mouseX: number, mouseY: number) {
  //   const rect = this.element.getBoundingClientRect()
  //   const { left, width, bottom, height } = rect
  //
  //   const time = this.transform.translationX +
  //       this.transform.spanX * (mouseX - left) / width
  //
  //   block.note.time = Math.round(time * this.beatsPerUnit) / this.beatsPerUnit
  //
  //   const logPitch = this.transform.translationY +
  //       this.transform.spanY * (bottom - mouseY) / height
  //
  //   const octave = Math.floor(logPitch)
  //
  //   const quantizedRelativePitch = closest(
  //       this.scale,
  //       2 ** (logPitch - octave),
  //       (pitch) => pitch.number)
  //
  //   const quantizedPitch = (2 ** octave) * quantizedRelativePitch.number
  //
  //   block.note.pitch = quantizedPitch
  //
  //   block.element.textContent = quantizedRelativePitch.toString()
  //
  //   this.drawBlock(block, rect)
  // }
  //
  // private drawBlock (block: PianoRollBlock, { width, height }: DOMRect) {
  //   const note = block.note
  //
  //   const x = (note.time - this.transform.translationX) /
  //       this.transform.spanX * width
  //
  //   const y = (Math.log2(note.pitch) - this.transform.translationY) /
  //       this.transform.spanY * height
  //
  //   block.setPosition(x, height - y)
  // }
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