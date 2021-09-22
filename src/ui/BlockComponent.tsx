import { forwardRef, MouseEventHandler } from 'react'
import Block from '../composition/Block'
import { cls } from '../util'
import style from './BlockComponent.module.css'
import common from './common.module.css'
import Pitch from '../Pitch'
import Section from '../composition/Section'

type Props = {
  block: Block,
  blockHeight: number,
  isSelected: boolean,
  onClick: MouseEventHandler
}

export default forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { block } = props

  const divProps = {
    key: block.id,
    ref: ref,
    className: cls(style.block, props.isSelected && common.selected),
    style: {height: `${props.blockHeight * block.computedDuration}rem`},
    onClick: props.onClick,
  }

  return <div {...divProps}>
    {block.element instanceof Pitch && `${block.element.octave} . ${block.element.interval.toString()}`}
    {block.element instanceof Section && block.element.name}
    <div>{block.duration.toString()}</div>
  </div>
})