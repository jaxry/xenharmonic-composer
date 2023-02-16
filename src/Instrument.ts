import Note from './Note'
import { audioContext } from './audioContext'
import { sawWave } from './waves'

export default class Instrument {
  src: AudioBufferSourceNode
  gain: GainNode

  constructor () {
  }

  queue (time: number, note: Note, prevNote?: Note, nextNote?: Note) {
    if (!prevNote) {
      this.newGain()
      this.newBufferSource()
      this.src.start(time, Math.random() * this.bufferLength())
    }

    this.src.playbackRate.setValueAtTime(2 ** (note.pitch / 12), time)
    this.src.detune.setValueAtTime(5 * (Math.random() - 0.5), time)

    this.gain.gain.setValueAtTime(0, time)
    this.gain.gain.linearRampToValueAtTime(0.1, time + 0.005)

    const endTime = time + 0.02

    this.gain.gain.setTargetAtTime(0, endTime, 0.4)

    if (!nextNote) {
      this.src.stop(endTime + 0.4 * 5)
    }
  }

  play () {

  }

  private newGain () {
    this.gain = audioContext.createGain()
    this.gain.gain.value = 0
    this.gain.connect(audioContext.destination)
  }

  // call after newGain
  private newBufferSource () {
    this.src = audioContext.createBufferSource()
    this.src.buffer = sawWave
    this.src.loop = true
    this.src.connect(this.gain)
  }

  private bufferLength () {
    return this.src.buffer!.length / this.src.buffer!.sampleRate
  }
}