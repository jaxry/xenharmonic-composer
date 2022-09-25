import Component from './Component'
import { makeStyle } from '../makeStyle'
import { numToPx } from '../../util'
import PianoRoll from './PianoRoll'
import colors from '../colors'
import { addModulationToPianoRoll } from './PianoRoll/modulations'

export default class PianoRollModulationBar extends Component {
  modulationBar = document.createElement('div')

  constructor (pianoRoll: PianoRoll) {
    super()

    this.element.classList.add(modulationBarContainerStyle)
    pianoRoll.gridContainer.addEventListener('scroll', () => {
      this.element.scrollLeft = pianoRoll.gridContainer.scrollLeft
    })

    this.modulationBar.classList.add(modulationBarStyle)
    this.modulationBar.style.width = numToPx(pianoRoll.width)
    this.element.append(this.modulationBar)

    setTimeout(() => {
      const scrollBarWidth =
          pianoRoll.gridContainer.offsetWidth -
          pianoRoll.gridContainer.clientWidth
      if (scrollBarWidth > 0) {
        this.element.style.right = numToPx(scrollBarWidth)
      }
    })

    this.modulationBar.addEventListener('click', (e) => {
      const { time } = pianoRoll.mouseToNote(e.clientX, e.clientY)
      addModulationToPianoRoll(pianoRoll, time)
    })
  }
}

const modulationBarContainerStyle = makeStyle({
  overflow: `hidden`,
  position: `absolute`,
  left: `0`,
  right: `0`,
  top: `0`,
  background: colors.yellow[900] + `77`,
})

const modulationBarStyle = makeStyle({
  height: `1rem`,
})
