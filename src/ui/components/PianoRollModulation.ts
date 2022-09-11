import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import createSVG from '../createSVG'
import { mod, numToPixel, removeChildren } from '../../util'
import { Modulation } from '../../modulation'

export default class PianoRollModulation extends Component {
  onDrag?: (block: this, x: number, y: number) => void

  constructor (public modulation: Modulation, mouseEvent: MouseEvent) {
    super(createSVG('g'))

    this.addDragBehavior(mouseEvent)
  }

  setPosition (x: number, y: number, octaveHeight: number, totalHeight: number) {
    removeChildren(this.element)

    for (y = mod(y, octaveHeight); y < totalHeight; y += octaveHeight) {
      const circle = createSVG('circle')
      circle.classList.add(circleStyle)
      circle.setAttribute('r', '6')
      circle.setAttribute('cx', numToPixel(x))
      circle.setAttribute('cy', numToPixel(y))
      this.element.append(circle)
    }
  }

  private addDragBehavior (pointerEvent: MouseEvent) {
    let mouseDiffX: number
    let mouseDiffY: number
    let rect: DOMRect

    makeDraggable(this.element, (e) => {
      this.onDrag?.(this, e.clientX - mouseDiffX, e.clientY - mouseDiffY)
    }, {
      onDown: (e) => {
        rect = (e.target as Element).getBoundingClientRect()
        mouseDiffX = e.clientX - rect.left - rect.width / 2
        mouseDiffY = e.clientY - rect.top - rect.height / 2
      },
      startEnabled: pointerEvent,
    })
  }
}

const circleStyle = makeStyle({
  fill: colors.yellow[300],
  cursor: `move`,
})