import { useState } from 'react'
import Composition from '../composition/Composition'
import Interval from '../Interval'
import { cls } from '../util'
import style from './IntervalEditor.module.css'
import IntervalEditorPowers from './IntervalPowers'
import common from './common.module.css'
import useRerender from './hooks/useRerender'
import { playInterval } from '../play'

export default function IntervalEditor(props: { composition: Composition }) {
  const { composition } = props
  const { intervals } = composition

  const rerender = useRerender()

  const [selectedInterval, setSelectedInterval] = useState<Interval>(intervals[0])
  
  const add = () => {
    const interval = composition.addInterval()
    setSelectedInterval(interval)
  }

  const select = (interval: Interval) => {
    return () => {
      playInterval(interval)
      setSelectedInterval(interval)
    }
  }

  const changeInterval = () => {
    composition.sortIntervals()
    rerender()
  }

  const deleteInterval = (interval: Interval) => {
    composition.deleteInterval(interval)
    rerender()
  }

  return <div>
    <div className={style.list}>
      {intervals.map((interval, i) => {
        return <button 
          key={i} 
          className={cls(interval === selectedInterval && common.selected)} 
          onClick={select(interval)}>
            {interval.powers.join(' ')}
        </button>
      })}
      <button onClick={add} className={common.primary}>New</button>
    </div>
    <IntervalEditorPowers 
      interval={selectedInterval} 
      onChange={changeInterval}
      onDelete={deleteInterval} />
  </div>
}