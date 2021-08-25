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

// export default class Fraction {
//   private _numerator!: number
//   private _denominator!: number
//   quotient!: number
  
//   constructor(numerator = 1, denominator = 1) {
//     this.numerator = numerator
//     this.denominator = denominator
//   }

//   get numerator() {
//     return this._numerator
//   }

//   set numerator(x: number) {
//     this._numerator = x
//     this.updateQuotient()
//   }

//   get denominator() {
//     return this._denominator
//   }

//   set denominator(x: number) {
//     this._denominator = x
//     this.updateQuotient()
//   }

//   simplify() {
//     const gcd = computeGcd(this.numerator, this.denominator)
//     this.numerator /= gcd
//     this.denominator /= gcd
//   }

//   multiply(factor: Fraction) {
//     this.numerator *= factor.numerator
//     this.denominator *= factor.denominator
//     this.simplify()
//   }

//   toString() {
//     if (this.denominator > 1) {
//       return `${this.numerator} / ${this.denominator}`
//     } else {
//       return this.numerator
//     }
//   }

//   private updateQuotient() {
//     this.quotient = this._numerator / this._denominator
//   }
// }