import Pitch from '../Pitch'
import Block from '../composition/Block'

export default function changePitch(block: Block, pitch?: Pitch) {
  block.element = pitch ?? null
}
