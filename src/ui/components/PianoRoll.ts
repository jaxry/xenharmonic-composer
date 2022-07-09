import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border, borderRadius } from '../theme'
import { lerp } from '../../util'
import PianoRollGridLines from './PianoRollGridLines'
import PanZoom from '../panZoom'

export default class PianoRoll extends Component {
  gridLines: PianoRollGridLines

  blockContainer = document.createElement('div')
  blocks = new Set<PianoRollBlock>()

  transform = new DOMMatrix()

  beatsPerUnit = 4

  constructor (public notes: Set<Note>) {
    super()

    this.element.classList.add(containerStyle)
    this.element.append(this.blockContainer)

    this.blockContainer.classList.add(blockContainerStyle)

    this.element.addEventListener('pointerdown', (e) => {
      if (e.target !== e.currentTarget || e.button !== 0) {
        return
      }
      this.addNote(e.clientX, e.clientY)
    })

    this.gridLines = this.newComponent(PianoRollGridLines)
    this.element.append(this.gridLines.element)

    new PanZoom(this.element, this.transform, () => {
      this.gridLines.draw(this.beatsPerUnit, this.transform)
      this.updateBlockPositions()
    })

    setTimeout(() => {
      this.gridLines.draw(this.beatsPerUnit, this.transform)
    })

    this.transform.scaleSelf(1 / 4, 1)
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
    const { left, width, top, bottom } = this.element.getBoundingClientRect()

    const tx = this.transform.e
    const sx = this.transform.a

    const time = ((mouseX - left) - tx) / width / sx

    block.note.time = Math.round(time * this.beatsPerUnit) / this.beatsPerUnit

    const x = block.note.time * sx * width + tx

    const pitch = lerp(bottom, top, -1, 0, mouseY)
    const logPitch = Math.round(pitch * 12) / 12
    block.note.pitch = 2 ** logPitch
    const y = lerp(-1, 0, bottom, top, logPitch)

    block.setPosition(x, y - top)
  }

  private updateBlockPositions () {
    const { width, top, bottom, y } = this.element.getBoundingClientRect()

    const tx = this.transform.e
    const sx = this.transform.a

    for (const block of this.blocks) {
      const x = block.note.time * sx * width + tx
      const y = lerp(-1, 0, bottom, top, Math.log2(block.note.pitch))
      block.setPosition(x, y - top)
    }
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
  transformOrigin: `top left`,
})