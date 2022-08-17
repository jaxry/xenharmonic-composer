import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import { backgroundColor } from '../theme'
import { Note } from '../../Note'

export default class PianoRollBlock extends Component {
  onDrag?: (block: this, x: number, y: number) => void
  onDragEdge?: (block: this, x: number) => void

  constructor (public note: Note, pointerEvent: PointerEvent) {
    super()
    this.element.classList.add(containerStyle)
    this.addDragBehavior(pointerEvent)
  }

  setPosition (x: number, y: number) {
    this.element.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px) translate(0, -50%)`
  }

  setWidth (width: number) {
    this.element.style.width = `${Math.round(width)}px`
  }

  private addDragBehavior (pointerEvent: PointerEvent) {
    let mouseDiffX: number
    let mouseDiffY: number
    let rect: DOMRect

    makeDraggable(this.element, (e) => {
      const x = e.clientX - mouseDiffX
      const y = e.clientY - mouseDiffY + rect.height / 2
      this.onDrag?.(this, x, y)
    }, {
      onDown: (e) => {
        rect = this.element.getBoundingClientRect()
        mouseDiffX = e.clientX - rect.x
        mouseDiffY = e.clientY - rect.y
      },
      startEnabled: pointerEvent,
    })

    const edge = document.createElement('div')
    edge.classList.add(edgeStyle)
    this.element.append(edge)
    makeDraggable(edge, (e) => {
      const x = e.clientX - mouseDiffX
      this.onDragEdge?.(this, x)
    }, {
      onDown: (e) => {
        rect = edge.getBoundingClientRect()
        mouseDiffX = e.clientX - rect.right
        e.stopPropagation()
      }
    })
  }
}

const containerStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  left: `0`,
  height: `var(--blockHeight)`,
  background: colors.green[300],
  borderRadius: '0.25rem',
  cursor: `move`,
  color: backgroundColor['700'],
})

const edgeStyle = makeStyle({
  position: `absolute`,
  top: `0`,
  right: `0`,
  bottom: `0`,
  width: `0.5rem`,
  cursor: `ew-resize`
})
