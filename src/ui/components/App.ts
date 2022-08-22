import Component from './Component'
import { makeStyle } from '../makeStyle'
import '../preflight.css'
import PianoRoll from './PianoRoll'
import playNotes from '../../playNotes'
import { backgroundColor } from '../theme'
import { Note } from '../../Note'
import { Modulation } from '../../modulation'

export default class App extends Component {
  notes: Set<Note> = new Set()
  modulations: Modulation[] = []

  constructor (element: HTMLElement) {
    super(element)

    const pianoRoll = this.newComponent(PianoRoll, this.notes, this.modulations)

    this.element.append(pianoRoll.element)

    const play = document.createElement('button')
    play.innerText = 'Play'
    play.addEventListener('click', () => {
      playNotes(this.notes, this.modulations)
    })
    this.element.append(play)
  }
}

makeStyle('body', {
  fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  colorScheme: `dark`,
  background: backgroundColor[900],
  color: backgroundColor[200],
  height: `100vh`,
  overflow: `hidden`,
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
})