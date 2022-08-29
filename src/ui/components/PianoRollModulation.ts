import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import createSVG from '../createSVG'
import { numToPixel } from '../../util'
import { Modulation } from '../../modulation'

export default class PianoRollModulation extends Component {
  onDrag?: (block: this, x: number, y: number) => void

  constructor (public modulation: Modulation, mouseEvent: MouseEvent) {
    super(createSVG('circle'))
    this.element.classList.add(containerStyle)
    this.element.setAttribute('r', '6')
    this.addDragBehavior(mouseEvent)
  }

  setPosition (x: number, y: number) {
    this.element.setAttribute('cx', numToPixel(x))
    this.element.setAttribute('cy', numToPixel(y))
  }

  private addDragBehavior (pointerEvent: MouseEvent) {
    let mouseDiffX: number
    let mouseDiffY: number
    let rect: DOMRect

    makeDraggable(this.element, (e) => {
      this.onDrag?.(this, e.clientX - mouseDiffX, e.clientY - mouseDiffY)
    }, {
      onDown: (e) => {
        rect = this.element.getBoundingClientRect()
        mouseDiffX = e.clientX - rect.left - rect.width / 2
        mouseDiffY = e.clientY - rect.top - rect.height / 2
      },
      startEnabled: pointerEvent,
    })
  }
}

const containerStyle = makeStyle({
  fill: colors.yellow[300],
  cursor: `move`,
})