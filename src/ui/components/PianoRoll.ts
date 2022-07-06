import Component from './Component'
import PianoRollBlock from './PianoRollBlock'
import { makeStyle } from '../makeStyle'
import { border } from '../theme'
import getRelativeCoords from '../getRelativeCoords'

export default class PianoRoll extends Component {

  constructor (public notes: Set<Note>) {
    super()

    this.element.classList.add(containerStyle)

    this.element.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) {
        return
      }
      const note = { pitch: 1, time: 0 }
      this.notes.add(note)

      const block = this.newComponent(PianoRollBlock, note)
      this.element.append(block.element)

      const { x, y } = getRelativeCoords(this.element, e)
      block.setPosition(x, y)
    })
  }
}

const containerStyle = makeStyle({
  position: `relative`,
  margin: `1rem`,
  height: `10rem`,
  border,
})