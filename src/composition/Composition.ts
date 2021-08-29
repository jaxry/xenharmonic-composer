import Interval from '../Interval'
import addBlock from '../operations/addBlock'
import Pitch from '../Pitch'
import Section from './Section'
import Modulations from './Modulations'
import { playSection } from '../play'
import { audioCtx } from '..'

export default class Composition {
  intervals: Interval[] = []
  rootSection = new Section()
  modulations = new Modulations()
  globalTempoScale = 0.5

  private playingOutput?: GainNode

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
  }

  play(section: Section, beginning: number, tempo: number) {
    this.playingOutput?.disconnect()
    this.playingOutput = audioCtx.createGain()
    this.playingOutput.gain.value = 0.1
    this.playingOutput.connect(audioCtx.destination)
    playSection(section, {
      composition: this,
      startTime: audioCtx.currentTime,
      sectionBeginning: 0,
      modulationOffset: beginning,
      tempo,
      output: this.playingOutput
    })
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