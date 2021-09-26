import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import Composition from '../composition/Composition'
import Section from '../composition/Section'
import { cls } from '../util'
import usePersistentState from './hooks/usePersistentState'
import style from './SectionSelect.module.css'

type Props = {
  composition: Composition
  onSelect: (section: Section) => void
}

export default function SectionSelect({ composition, onSelect }: Props) {
  const [search, setSearch] = usePersistentState('', 'sectionSearch')
  const [focusedSection, setFocusedSection] = useState<Section | null>(null)

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  })

  return <div className={style.sectionSelect}>
    <input ref={inputRef} className={style.search} value={search} onChange={onChange} />
    <ul className={style.sectionList}>
      {composition.sections
        .filter((section) => {
          return section.name.includes(search)
        })
        .map((section, i) => {
          return <li 
            key={i}
            className={cls(style.section, section === focusedSection && style.focused)}
            onPointerEnter={() => setFocusedSection(section)}
            onClick={() => onSelect(section)}>
            {section.name}
          </li>
        })
      }
    </ul>

  </div>
}