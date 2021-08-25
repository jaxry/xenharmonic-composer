import Section from './composition/Section'
import Chain from './composition/Chain'
import Pitch from './Pitch'
import Interval from './Interval'
import { Instrument } from './Instrument'
import InstrumentPlayer from './InstrumentPlayer'
import Modulations, { applyModulation } from './composition/Modulations'

const squareWave = makeWave()

export default class MusicPlayer {
  ctx = new AudioContext()
  out = this.ctx.createGain()
  sample!: AudioBuffer

  constructor() {
    this.out.gain.value = 0.1
    this.out.connect(this.ctx.destination)
  }

  playInterval(interval: Interval) {
    const instrument = new Instrument(squareWave)
    instrument.vibratoAmp = 0
    instrument.release = 0.3
    new InstrumentPlayer(this.ctx, this.out, instrument).start().play(1).stop(0.1)
    new InstrumentPlayer(this.ctx, this.out, instrument).start().play(interval.quotient).stop(0.1)
  }

  playLivePitch(pitch: Pitch, modulation = 1) {
    const instrument = new Instrument(squareWave)
    instrument.vibratoAmp = 0
    const player = new InstrumentPlayer(this.ctx, this.out, instrument)
    player.start().play(pitch.ratio * modulation)
    return player
  }

  playFreq(freq: number) {
    const instrument = new Instrument(squareWave)
    new InstrumentPlayer(this.ctx, this.out, instrument).start().play(freq).stop(0.1)
  }

  playChain(chain: Chain, modulations: Modulations, ctxBeginning: number, sectionBeginning: number, tempo: number, tempoScale: number) {  
    const instrument = new Instrument(squareWave)
    const player = new InstrumentPlayer(this.ctx, this.out, instrument, ctxBeginning)

    let nextModulationIndex = 0
    let nextModulation = modulations.list[nextModulationIndex]
    let modulation = 1

    player.start(tempoScale * (sectionBeginning + chain.beginning * tempo))
    player.stop(tempoScale * (sectionBeginning + chain.end * tempo))

    for (const [block, blockBeginning] of chain.blockPositions()) {
      const globalBeginning = sectionBeginning + blockBeginning * tempo

      while (globalBeginning >= nextModulation?.position) {
        modulation = applyModulation(modulation, nextModulation)
        nextModulation = modulations.list[++nextModulationIndex]
      }

      if (block.element instanceof Pitch) {
        player.play(modulation * block.element.ratio, tempoScale * globalBeginning)
      } else {
        player.release(tempoScale * globalBeginning)

        if (block.element instanceof Section) {
          this.playSection(block.element, modulations, ctxBeginning, globalBeginning, tempo * block.duration.quotient, tempoScale)
        }
      }
    }
  }

  playSection(section: Section, modulations: Modulations, ctxBeginning = this.ctx.currentTime + 0.1, sectionBeginning = 0,  tempo = 1, tempoScale = 0.5) {
    for (const chain of section.chains()) {
      this.playChain(chain, modulations, ctxBeginning, sectionBeginning, tempo, tempoScale)
    }
  }

  loadSample(audioData: ArrayBuffer) {
    this.ctx.decodeAudioData(audioData)
      .then(buffer => {
        this.sample = buffer
      })
  }
}

function initWaveformBuffer(length = 32) {
  return new AudioBuffer({
    length,
    sampleRate: length * 440
  })
}

function makeWave() {
  const buffer = initWaveformBuffer()

  const d = buffer.getChannelData(0)
  // for (let i = 0; i < d.length; i++) {
  //   d[i] = Math.sin(i / buffer.length * 2 * Math.PI)
  // }
  for (let i = 0; i < d.length / 4; i++) {
    d[i] = -0.5
  }

  for (let i = Math.ceil(d.length / 4); i < d.length; i++) {
    d[i] = 0.5
  }

  return buffer
}