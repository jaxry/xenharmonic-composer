import Section from '../composition/Section'
import useRerender from './hooks/useRerender'
import style from './SectionName.module.css'


export default function SectionName(props: {section: Section}) {
  const { section } = props

   const rerender = useRerender()
    
  const onSectionNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    section.name = event.target.value
    rerender()
  }
  
  return <input type='text' className={style.sectionName} value={section.name} onChange={onSectionNameChange} />
}