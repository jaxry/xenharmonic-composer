import makeDraggable from '../../makeDraggable'
import PianoRoll from '../PianoRoll'

export function panBehavior (pianoRoll: PianoRoll) {
  makeDraggable(pianoRoll.gridContainer, {
    onDown: (e) => {
      if (e.button !== 1) {
        return
      }

      pianoRoll.gridContainer.style.cursor = 'all-scroll'

      const startX = e.clientX
      const startY = e.clientY
      const startScrollX = pianoRoll.gridContainer.scrollLeft
      const startScrollY = pianoRoll.gridContainer.scrollTop
      return (e) => {
        pianoRoll.gridContainer.scrollLeft = startScrollX + startX - e.clientX
        pianoRoll.gridContainer.scrollTop = startScrollY + startY - e.clientY
      }
    },
    onUp: () => {
      pianoRoll.gridContainer.style.cursor = ''
    },
  })
}
