import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import { backgroundColor } from '../theme'
import { Note } from '../../Note'
import createSVG from '../createSVG'
import { numToPixel } from '../../util'
import throttle from '../throttle'

export default class PianoRollBlock extends Component {
  onDrag?: (block: this, x: number, y: number) => void
  onDragEdge?: (block: this, x: number) => void

  constructor (public note: Note, mouseEvent: MouseEvent) {
    super(createSVG('rect'))
    this.element.classList.add(containerStyle)
    this.element.setAttribute('rx', '6')
    this.addDragBehavior(mouseEvent)
  }

  setPosition (x: number, y: number) {
    this.element.setAttribute('x', numToPixel(x))
    this.element.setAttribute('y', numToPixel(y))
  }

  setWidth (width: number) {
    this.element.setAttribute('width', numToPixel(width))
  }

  private addDragBehavior (pointerEvent: MouseEvent) {
    let mouseDiffX: number
    let mouseDiffY: number
    let rect: DOMRect

    let extending = false

    makeDraggable(this.element, (e) => {
      if (extending) {
        this.onDragEdge?.(this, e.clientX - mouseDiffX)
      } else {
        this.onDrag?.(this, e.clientX - mouseDiffX, e.clientY - mouseDiffY)
      }
    }, {
      onDown: (e) => {
        rect = this.element.getBoundingClientRect()
        extending = rect.right - e.clientX < extendingHandleSize
        mouseDiffX = e.clientX - (extending ? rect.right : rect.left)
        mouseDiffY = e.clientY - rect.top - rect.height / 2
      },
      startEnabled: pointerEvent,
    })

    this.element.addEventListener('mousemove', throttle((e) => {
      const rect = this.element.getBoundingClientRect()
      const extending = rect.right - e.clientX < extendingHandleSize
      this.element.style.cursor = extending ? 'ew-resize' : 'move'
    }))
    this.element.addEventListener('mouseleave', () => {
      this.element.style.cursor = ''
    })
  }
}

const extendingHandleSize = 12

const containerStyle = makeStyle({
  height: `var(--blockHeight)`,
  fill: colors.green[300],
  cursor: `move`,
  color: backgroundColor['700'],
  transform: `translate(0, -50%)`,
})