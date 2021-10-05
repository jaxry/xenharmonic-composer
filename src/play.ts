import { audioCtx } from './audioCtx'
import type Chain from './composition/Chain'
import type Composition from './composition/Composition'
import { applyModulation } from "./composition/Modulations"
import Section from "./composition/Section"
import { Instrument } from "./Instrument"
import InstrumentPlayer from "./InstrumentPlayer"
import type Interval from "./Interval"
import Pitch from "./Pitch"
import { squareWave } from "./waves"

function makeOutput(gain = 1) {
  const out = audioCtx.createGain()
  out.gain.value = 0.2 * gain
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

type PlayProps = {
  composition: Composition,
  startTime: number,
  sectionBeginning: number,
  modulationOffset: number,
  tempo: number,
  output: AudioNode
}

export function playSection(section: Section, props: PlayProps) {
  for (const chain of section.chains()) {
    playChain(chain, props)
  }
}

export function playChain(chain: Chain, props: PlayProps) {  
  const { modulations, globalTempoScale } = props.composition
  const instrument = new Instrument(squareWave)
  const player = new InstrumentPlayer(props.output, instrument)

  let nextModulationIndex = 0
  let nextModulation = modulations.list[nextModulationIndex]
  let modulation = 1

  const chainGlobalStart = props.sectionBeginning + chain.beginning * props.tempo
  const chainGlobalEnd =  props.sectionBeginning + chain.end * props.tempo

  player.start(globalTempoScale * chainGlobalStart, props.startTime)
  player.stop(globalTempoScale * chainGlobalEnd, props.startTime)

  for (const [block, blockBeginning] of chain.blockPositions()) {
    const blockGlobalBeginning = props.sectionBeginning + blockBeginning * props.tempo

    while (blockGlobalBeginning + props.modulationOffset >= nextModulation?.position) {
      modulation = applyModulation(modulation, nextModulation)
      nextModulation = modulations.list[++nextModulationIndex]
    }

    if (block.element instanceof Pitch) {
      player.play(
        modulation * block.element.ratio, 
        globalTempoScale * blockGlobalBeginning, 
        props.startTime
      )
    } else {
      player.release(globalTempoScale * blockGlobalBeginning, props.startTime)

      if (block.element instanceof Section) {
        playSection(block.element, {
          ...props, 
          sectionBeginning: blockGlobalBeginning,
          tempo: props.tempo * block.duration.quotient
        })
      }
    }
  }
}