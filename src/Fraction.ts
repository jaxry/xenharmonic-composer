import computeGcd from './computeGcd'

export default class Fraction {
  numerator: number
  denominator: number
  
  constructor(numerator = 1, denominator = 1) {
    this.numerator = numerator
    this.denominator = denominator
  }

  simplify() {
    const gcd = computeGcd(this.numerator, this.denominator)
    this.numerator /= gcd
    this.denominator /= gcd
  }

  multiply(x: Fraction) {
    this.numerator *= x.numerator
    this.denominator *= x.denominator
    this.simplify()
  }

  add(x: Fraction) {
    this.numerator = this.numerator * x.denominator + this.denominator * x.numerator
    this.denominator = this.denominator * x.denominator
    this.simplify()
  }

  get quotient() {
    return this.numerator / this.denominator
  }

  toString() {
    if (this.denominator > 1) {
      return `${this.numerator} / ${this.denominator}`
    } else {
      return this.numerator
    }
  }
}