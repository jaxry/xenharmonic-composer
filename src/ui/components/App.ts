import Component from './Component'
import { makeStyle } from '../makeStyle'
import '../preflight.css'
import colors from '../colors'
import PianoRoll from './PianoRoll'
import playNotes from '../../playNotes'

export default class App extends Component {
  notes: Set<Note> = new Set()

  constructor (element: HTMLElement) {
    super(element)

    const pianoRoll = this.newComponent(PianoRoll, this.notes)

    this.element.append(pianoRoll.element)

    const play = document.createElement('button')
    play.innerText = 'Play'
    play.addEventListener('click', () => {
      playNotes(this.notes)
    })
    this.element.append(play)
  }
}

makeStyle('body', {
  fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  colorScheme: `dark`,
  background: colors.zinc[900],
  color: colors.zinc[200],
  height: `100vh`,
  overflow: `hidden`,
})