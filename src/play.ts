import { Instrument } from "./Instrument"
import InstrumentPlayer from "./InstrumentPlayer"
import { squareWave } from "./waves"
import { audioCtx } from "."
import Interval from "./Interval"
import Pitch from "./Pitch"
import Section from "./composition/Section"
import Composition from "./composition/Composition"
import Chain from "./composition/Chain"
import { applyModulation } from "./composition/Modulations"

function makeOutput(gain = 0.1) {
  const out = audioCtx.createGain()
  out.gain.value = gain
  out.connect(audioCtx.destination)
  return out
}

export function playFreq(freq: number) {
  const instrument = new Instrument(squareWave)

  new InstrumentPlayer(makeOutput(), instrument).start().play(freq).stop(0.1)
}

export function playInterval(interval: Interval) {
  const instrument = new Instrument(squareWave)
  instrument.release = 0.3

  const output = makeOutput()

  new InstrumentPlayer(output, instrument).start().play(1).stop(0.1)
  new InstrumentPlayer(output, instrument).start().play(interval.quotient).stop(0.1)
}

export function playLivePitch(pitch: Pitch, modulation = 1) {
  const instrument = new Instrument(squareWave)
  const player = new InstrumentPlayer(makeOutput(), instrument)
  player.start().play(pitch.ratio * modulation)
  return player
}

export function playSection(section: Section, composition: Composition, ctxBeginning = audioCtx.currentTime + 0.1, sectionBeginning = 0,  tempo = 1) {
  for (const chain of section.chains()) {
    playChain(chain, composition, ctxBeginning, sectionBeginning, tempo)
  }
}

export function playChain(chain: Chain, composition: Composition, ctxBeginning: number, sectionBeginning: number, tempo: number) {  
  const { modulations, globalTempoScale } = composition
  const instrument = new Instrument(squareWave)
  const player = new InstrumentPlayer(makeOutput(), instrument, ctxBeginning)

  let nextModulationIndex = 0
  let nextModulation = modulations.list[nextModulationIndex]
  let modulation = 1

  player.start(globalTempoScale * (sectionBeginning + chain.beginning * tempo))
  player.stop(globalTempoScale * (sectionBeginning + chain.end * tempo))

  for (const [block, blockBeginning] of chain.blockPositions()) {
    const globalBeginning = sectionBeginning + blockBeginning * tempo

    while (globalBeginning >= nextModulation?.position) {
      modulation = applyModulation(modulation, nextModulation)
      nextModulation = modulations.list[++nextModulationIndex]
    }

    if (block.element instanceof Pitch) {
      player.play(modulation * block.element.ratio, globalTempoScale * globalBeginning)
    } else {
      player.release(globalTempoScale * globalBeginning)

      if (block.element instanceof Section) {
        playSection(block.element, composition, ctxBeginning, globalBeginning, tempo * block.duration.quotient)
      }
    }
  }
}