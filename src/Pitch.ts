import type Interval from './Interval'

export default class Pitch {
  interval: Interval
  octave: number
  
  constructor(interval: Interval, octave = 0) {
    this.interval = interval
    this.octave = octave
  }

  get ratio() {
    return 2 ** this.octave * this.interval.quotient
  }
}
