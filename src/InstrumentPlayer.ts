import { audioCtx } from './audioCtx'
import type { Instrument } from './Instrument'

const decayScale = 5
const attackScale = 3

export default class InstrumentPlayer {
  instrument: Instrument

  private src: AudioBufferSourceNode
  private gain: GainNode
  // private vibrato: OscillatorNode
  private panner: StereoPannerNode
  private prevPlayback = 0

  constructor(out: AudioNode, instrument: Instrument) {
    this.instrument = instrument

    this.src = audioCtx.createBufferSource()
    this.src.buffer = instrument.buffer
    this.src.loop = true

    this.panner = audioCtx.createStereoPanner()
  
    this.gain = audioCtx.createGain()
    this.gain.gain.value = 0
    this.src.connect(this.gain).connect(this.panner).connect(out)
  
    // this.vibrato = audioCtx.createOscillator()
    // this.vibrato.frequency.value = instrument.vibratoFreq
    // const vibratoGain = audioCtx.createGain()
    // vibratoGain.gain.value = instrument.vibratoAmp
    // this.vibrato.connect(vibratoGain).connect(this.panner.pan)
  }

  start(timeOffset = 0, time = audioCtx.currentTime) {
    time += timeOffset
    this.src.start(time)
    // this.vibrato.start(time)

    return this
  }

  play(playbackMultiplier = 1, timeOffset = 0, time = audioCtx.currentTime) {
    time += timeOffset
    // if (!this.prevPlayback) {
      this.src.playbackRate.setValueAtTime(playbackMultiplier, time)
    // } else {
    //   const duration = Math.abs(playbackMultiplier - this.prevPlayback) * 0.02
    //   // this.src.playbackRate.setValueAtTime(this.prevPlayback, time)
    //   // this.src.playbackRate.exponentialRampToValueAtTime(playbackMultiplier, time + duration)
    //   this.src.playbackRate.setTargetAtTime(playbackMultiplier, time, duration)
    // }
    this.prevPlayback = playbackMultiplier

    this.panner.pan.setValueAtTime(0.5 * (Math.random() - 0.5), time)

    this.gain.gain.setTargetAtTime(1, time, this.instrument.attack)
    this.gain.gain.setTargetAtTime(this.instrument.sustain, time + attackScale * this.instrument.attack, this.instrument.decay)

    return this
  }

  release(timeOffset = 0, time = audioCtx.currentTime) {
    this.gain.gain.setTargetAtTime(0, time + timeOffset, this.instrument.release)

    return this
  }

  stop(timeOffset = 0, time = audioCtx.currentTime) {
    this.release(timeOffset, time)
    this.src.stop(time + timeOffset + decayScale * this.instrument.release)
    // this.vibrato.stop(time + timeOffset + decayScale * this.instrument.release)

    return this
  }
}