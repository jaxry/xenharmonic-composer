import Component from './Component'
import { makeStyle } from '../makeStyle'
import colors from '../colors'
import makeDraggable from '../makeDraggable'
import createSVG from '../createSVG'
import { mod, numToPixel, removeChildren } from '../../util'
import { Modulation } from '../../modulation'

export default class PianoRollModulation extends Component {
  onDrag?: (modulation: this, x: number, y: number) => void
  onRightClick?: (modulation: this, e: MouseEvent) => void

  constructor (public modulation: Modulation) {
    super(createSVG('g'))

    this.addMouseBehavior()
  }

  setPosition (
      x: number, y: number, octaveHeight: number, totalHeight: number) {
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

  private addMouseBehavior () {
    makeDraggable(this.element, {
      onDown: (e) => {
        const rect = (e.target as Element).getBoundingClientRect()
        const mouseDiffX = e.clientX - rect.left - rect.width / 2
        const mouseDiffY = e.clientY - rect.top - rect.height / 2
        return (e) => this.onDrag?.(
            this, e.clientX - mouseDiffX, e.clientY - mouseDiffY)
      },
    })
    this.element.addEventListener('mouseup', (e) => {
      if ((e as MouseEvent).button === 2) {
        this.onRightClick?.(this, e as MouseEvent)
      }
    })
  }
}

const circleStyle = makeStyle({
  fill: colors.yellow[300],
  cursor: `move`,
})