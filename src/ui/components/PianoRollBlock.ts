import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import { backgroundColor } from '../theme'

export default class PianoRollBlock extends Component {
  onDrag?: (x: number, y: number) => void

  constructor (public note: Note) {
    super()
    this.element.classList.add(containerStyle)
    this.addDragging()
  }

  setPosition (x: number, y: number) {
    const rect = this.element.getBoundingClientRect()
    this.element.style.transform = `translate(${x}px,${y - rect.height / 2}px)`
  }

  private addDragging () {
    let mouseDiffX: number
    let mouseDiffY: number
    let rect: DOMRect
    this.onRemove(makeDraggable(this.element, (e) => {
      const x = e.clientX - mouseDiffX
      const y = e.clientY - mouseDiffY + rect.height / 2
      this.onDrag?.(x, y)
    }, (e) => {
      rect = this.element.getBoundingClientRect()
      mouseDiffX = e.clientX - rect.x
      mouseDiffY = e.clientY - rect.y
    }))
  }
}

const containerStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  left: `0`,
  width: `4rem`,
  height: `1.5rem`,
  background: colors.green[300],
  cursor: `move`,
  color: backgroundColor['700'],
})
