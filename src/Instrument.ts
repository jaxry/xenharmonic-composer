import Note from './Note'
import { audioContext } from './audioContext'
import { sawWave } from './waves'

export default class Instrument {
  src: AudioBufferSourceNode
  gain: GainNode

  constructor () {
  }

  play (time: number, note: Note) {
    this.newBufferSource()
    this.newGain()

    this.src.connect(this.gain)

    this.src.playbackRate.value = 2 ** (note.pitch / 12)
    this.src.detune.value = 5 * (Math.random() - 0.5)

    this.src.start(time, Math.random() * this.bufferLength())

    this.gain.gain.setValueAtTime(0, time)
    this.gain.gain.linearRampToValueAtTime(0.1, time + 0.005)

    const endTime = time + 0.02

    this.gain.gain.setTargetAtTime(0, endTime, 0.4)
    this.src.stop(endTime + 0.4 * 5)
  }

  private newBufferSource () {
    this.src = audioContext.createBufferSource()
    this.src.buffer = sawWave
    this.src.loop = true
  }

  private newGain () {
    this.gain = audioContext.createGain()
    this.gain.gain.value = 0
    this.gain.connect(audioContext.destination)
  }

  private bufferLength () {
    return this.src.buffer!.length / this.src.buffer!.sampleRate
  }
}