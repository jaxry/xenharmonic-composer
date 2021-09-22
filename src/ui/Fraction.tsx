import style from './Fraction.module.css'

export default function Fraction(props: { numerator: number, denominator: number }) {
  return <div className={style.container}>
    <span className={style.numerator}>{props.numerator}</span>
    {props.denominator > 1 && <span className={style.denominator}>{props.denominator}</span>}
  </div>
}