import Interval from '../Interval'
import addBlock from '../operations/addBlock'
import Pitch from '../Pitch'
import Section from './Section'
import Modulations from './Modulations'
import { playSection } from '../play'

export default class Composition {
  intervals: Interval[] = []
  rootSection = new Section()
  modulations = new Modulations()
  globalTempoScale = 0.5

  constructor() {
    this.intervals.push(
      new Interval(0),
      new Interval(1),
      new Interval(-1),
      new Interval(0, 1),
      new Interval(0, -1),
      new Interval(1, -1),
      new Interval(-1, 1),
      new Interval(1, 1),
      new Interval(-1, -1),
      new Interval(2),
      new Interval(-2),
      new Interval(2, 1),
      new Interval(-2, -1),
      new Interval(2, -1),
      new Interval(-2, 1),
      new Interval(0, 0, 1),
      new Interval(0, 0, -1)
    )
    
    this.sortIntervals()

    this.rootSection.name = 'Main'
    let block = this.rootSection.findBlock(this.rootSection.tracks[0].chains[0].blocks[0])!
    block = addBlock(block, new Pitch(this.intervals[0]))
    const child = new Section()
    block = addBlock(block, child)
    child.containedIn.push(this.rootSection)
    addBlock(block, new Pitch(this.intervals[2]))

  }

  play() {
    playSection(this.rootSection, this)
  }

  addInterval() {
    const interval = new Interval(0)
    this.intervals.push(interval)
    this.sortIntervals()
    return interval
  }

  sortIntervals() {
    this.intervals.sort((a, b) => a.quotient - b.quotient)
  }

  deleteInterval(interval: Interval) {
    const i = this.intervals.findIndex(current => current === interval)
    this.intervals.splice(i, 1)

    this.sortIntervals()
  }
}