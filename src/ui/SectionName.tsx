import { ChangeEventHandler } from 'react'
import Composition from '../composition/Composition'
import Section from '../composition/Section'
import useRerender from './hooks/useRerender'
import style from './SectionName.module.css'

export default function SectionName(props: {composition: Composition, section: Section}) {
  const { section } = props

  const rerender = useRerender()
    
  const onSectionNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    section.name = event.target.value
    props.composition.sortSections()
    rerender()
  }
  
  return <input type='text' className={style.sectionName} value={section.name} onChange={onSectionNameChange} />
}