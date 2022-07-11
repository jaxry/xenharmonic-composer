import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import PianoRollGridLines from './PianoRollGridLines'
import PanZoom from '../panZoom'
import getScaleAndTranslation from '../getScaleAndTranslation'
import Fraction from '../../Fraction'

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
    spanY: 1
  }

  scale = scale

  constructor (public notes: Set<Note>) {
    super()

    this.element.classList.add(containerStyle)
    this.element.append(this.blockContainer)

    this.element.addEventListener('pointerdown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      // this.addNote(e.clientX, e.clientY)
    })

    this.gridLines = this.newComponent(PianoRollGridLines)
    this.element.append(this.gridLines.element)

    new PanZoom(this.element, this.transform, () => {
      this.drawGrid()
      this.updateBlockPositions()
    })

    setTimeout(() => {
      // this.transform.translateSelf(0, this.element.offsetHeight)
      this.drawGrid()
    })
  }

  private drawGrid() {
    // this.gridLines.draw(this.beatsPerUnit, this.scale, this.transform)
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
    // const { left, width, top, height } = this.element.getBoundingClientRect()
    //
    // const { tx, ty, sx, sy } = getScaleAndTranslation(this.transform)
    //
    // const time = ((mouseX - left) - tx) / width / sx
    // const quantizedTime = Math.round(time * this.beatsPerUnit) / this.beatsPerUnit
    // block.note.time = quantizedTime
    // const x = quantizedTime * sx * width + tx
    //
    // const logPitch = (ty - (mouseY - top)) / height / sy
    // const quantizedLogPitch = Math.round(logPitch * 12) / 12
    // block.note.pitch = 2 ** quantizedLogPitch
    // const y = ty - quantizedLogPitch * sy * height
    //
    // block.setPosition(x, y)
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
  new Fraction(15, 8)
]

export interface PianoRollTransform {
  translationX: number,
  translationY: number,
  spanX: number,
  spanY: number
}