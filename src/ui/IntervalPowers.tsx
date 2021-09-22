import { Fragment, useReducer } from 'react'
import Interval from '../Interval'
import { playInterval } from '../play'
import common from './common.module.css'
import Fraction from './Fraction'
import style from './IntervalPowers.module.css'

type Props = {
  interval: Interval, 
  onChange: (interval: Interval) => void
  onDelete: (interval: Interval) => void
}
export default function IntervalEditorPowers(props: Props) {
  const { interval, onChange, onDelete } = props

  const [confirmDelete, toggleConfirmDelete] = useReducer(confirmDelete => !confirmDelete, false)

  const addPower = () => {
    interval.add()
    onChange(interval)
  }

  const removePower = () => {
    interval.remove()
    onChange(interval)
  }

  const changePower = (index: number, value: number) => {
    interval.set(index, value)
    playInterval(interval)
    onChange(interval)
  }

  const deleteInterval = () => {
    toggleConfirmDelete()
    onDelete(interval)
  }

  return <div>
    <div className={style.equation}>
      <span className={style.prime}>2</span>
      <span className={style.power}>{interval.twoPower}</span>
      <span className={style.sign}>×</span>
      {interval.powers.map((x, i) => {
        return <Fragment key={i}>
          {(i > 0) && <span className={style.sign}>×</span>}
          <span className={style.prime}>{Interval.primes[i]}</span>
          <input className={style.power} type='number' value={x} onChange={(e) => changePower(i, parseInt(e.target.value))}/>
        </Fragment>
      })}
      <span className={style.sign}>=</span>
      <span className={style.fraction}><Fraction numerator={interval.numerator} denominator={interval.denominator} /></span>
      {interval.powers.length < 5 && <button className={common.primary} onClick={addPower}>Add</button>}
      {interval.powers.length > 1 && <button className={common.primary} onClick={removePower}>Remove</button>}
    </div>
    <div>
      <button className={common.warning} onClick={toggleConfirmDelete}>Delete Interval</button>
      {confirmDelete && <>
        <button onClick={toggleConfirmDelete}>No</button>
        <button onClick={deleteInterval}>Yes</button>
      </>}
    </div>
  </div>
}