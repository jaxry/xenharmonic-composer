import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import { lerp } from '../../util'

export default class PianoRollBlock extends Component {
  x = 0
  y = 0

  constructor (public note: Note) {
    super()
    this.element.classList.add(containerStyle)

    this.onRemove(makeDraggable(this.element, (e) => {
      this.x += e.movementX
      this.y += e.movementY
      this.updateNote()
    }))
  }

  setPosition (x: number, y: number) {
    this.x = x
    this.y = y
    this.updateNote()
  }

  updateNote () {
    this.element.style.transform = `translate(${this.x}px,${this.y}px)`

    const parentBBox = this.element.parentElement!.getBoundingClientRect()
    const bBox = this.element.getBoundingClientRect()

    this.note.time = lerp(parentBBox.left, parentBBox.right, 0, 3, bBox.x)
    this.note.pitch = lerp(parentBBox.top, parentBBox.bottom, 2, 0.5, bBox.y)
  }
}

const containerStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  left: `0`,
  width: `5rem`,
  height: `2rem`,
  background: colors.red[300],
})