export default class Interval {
  static primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]

  public powers: number[]
  public numerator!: number
  public denominator!: number

  // automatically computed power of two so that the interval is in the same octave to the root note
  public twoPower!: number

  public quotient!: number

  constructor(...powers: number[]) {
    this.powers = powers
    this.update()
  }

  set(index: number, value: number) {
    this.powers[index] = value
    this.update()
  }

  add() {
    this.powers.push(0)
    this.update()
  }

  remove() {
    this.powers.pop()
    this.update()
  }

  toString() {
    if (this.denominator > 1) {
      return `${this.numerator} / ${this.denominator}`
    } else {
      return this.numerator
    }
  }

  private update() {
    if (this.powers.length === 0) {
      this.quotient = 0
      return
    }

    let numerator = 1
    let denominator = 1

    for (let i = 0; i < this.powers.length; i++) {
      const p  = this.powers[i]
      if (p >= 0) {
        numerator *= Interval.primes[i] ** Math.abs(p)
      } else {
        denominator *= Interval.primes[i] ** Math.abs(p)
      }
    }

    this.twoPower = -Math.floor(Math.log2(numerator / denominator))
    if (this.twoPower >= 0) {
      numerator *= 2 ** Math.abs(this.twoPower)
    } else {
      denominator *= 2 ** Math.abs(this.twoPower)
    }
    
    this.numerator = numerator
    this.denominator = denominator
    this.quotient = numerator / denominator
  }
}