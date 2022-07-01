import Component from './Component'
import { makeStyle } from '../makeStyle'
import '../preflight.css'
import colors from '../colors'


export default class App extends Component {
  constructor (element: HTMLElement) {
    super(element)

    const test = document.createElement('div')
    test.innerText = 'hey there'

    this.element.append(test)
  }
}

makeStyle('body', {
  fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  colorScheme: `dark`,
  background: colors.zinc[900],
  color: colors.zinc[200],
})