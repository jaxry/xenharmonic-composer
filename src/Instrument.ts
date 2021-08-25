export interface InstrumentProps {
  attack: number // seconds
  decay: number // seconds
  sustain: number // gain between 0 and 1
  release: number // seconds

  vibratoFreq: number
  vibratoAmp: number
}

export class Instrument implements InstrumentProps {
  attack = 0.002 // seconds
  decay = 0.5 // seconds
  sustain = 0.2 // gain between 0 and 1
  release = 0.1 // seconds

  vibratoFreq = 3 + Math.random()
  vibratoAmp = 10

  buffer: AudioBuffer

  constructor(buffer: AudioBuffer) {
    this.buffer = buffer
  }
}