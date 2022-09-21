import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
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
    // TODO: extend hitbox should be its own rect so its easier to
    // deactivate extending on first drag
    makeDraggable(this.element, {
      onDown: (e) => {
        if (e.button !== 0) {
          return
        }
        const rect = this.element.getBoundingClientRect()
        const extending = rect.right - e.clientX < extendingHandleSize
        const mouseDiffX = e.clientX - (extending ? rect.right : rect.left)
        const mouseDiffY = e.clientY - rect.top - rect.height / 2
        return extending ?
            (e) => this.onDragEdge?.(this, e.clientX - mouseDiffX) :
            (e) => this.onDrag?.(
                this, e.clientX - mouseDiffX, e.clientY - mouseDiffY)
      },
      startEnabled: pointerEvent,
    })

    this.element.addEventListener('mousemove', throttle((e) => {
      const rect = this.element.getBoundingClientRect()
      const extending = rect.right - e.clientX < extendingHandleSize
      this.element.style.cursor = extending ? 'ew-resize' : 'move'
    }))
  }
}

const extendingHandleSize = 12

const containerStyle = makeStyle({
  height: `var(--blockHeight)`,
  fill: colors.green[300],
  transform: `translate(0, -50%)`,
})