import { useState } from 'react'
import { cls } from '../util'
import style from './Tabs.module.css'

export default function Tabs(props: { entries: { name: string, content: JSX.Element }[] }) {
  const [selectedTab, setSelectedTab] = useState(0)

  return <div className={style.container}>
    <div className={style.tabs}>
      {props.entries.map(({name}, i) => {
        const props = {
          key: i,
          onClick: () => {
            setSelectedTab(i)
          },
          className: cls(style.tab, i === selectedTab && style.selected)
        }

        return <div {...props}>{name}</div>
      })}
    </div>
    <div className={style.content}>
      {props.entries[selectedTab].content}
    </div>
  </div>
}