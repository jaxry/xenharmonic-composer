import PianoRoll from '../PianoRoll'
import makeDraggable from '../../makeDraggable'

export function deleteBlockBehavior (pianoRoll: PianoRoll) {
  makeDraggable(pianoRoll.svg, {
    onDown: (e) => {
      if (e.button !== 2) {
        return false
      }

      pianoRoll.svg.style.cursor = 'not-allowed'

      deleteBlock(e)
    },
    onOver: deleteBlock,
    onUp: () => {
      pianoRoll.svg.style.cursor = ''
    },
  })

  function deleteBlock (e: MouseEvent) {
    const block = pianoRoll.blockElementToBlock.get(e.target as Element)
    if (block) {
      pianoRoll.deleteBlock(block)
    }
  }
}