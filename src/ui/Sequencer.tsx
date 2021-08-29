import { useEffect, useRef, useState } from 'react'
import sequencerKeyBinds from './sequencerKeyBinds'
import Composition from '../composition/Composition'
import Section from '../composition/Section'
import Track from "../composition/Track"
import Pitch from '../Pitch'
import { cls, last, mapIter } from '../util'
import common from './common.module.css'
import Fraction from './Fraction'
import useClickOutside from './hooks/useClickOutside'
import useKeyPress from './hooks/useKeyPress'
import style from './Sequencer.module.css'
import { drillIntoSection, globalPosition, initialState, SequencerState, setSelected } from './SequencerState'
import { isSection } from '../composition/BlockLocation'
import { playFreq } from '../play'

export default function Sequencer(props: { composition: Composition }) {
  const { composition } = props
  const { modulations } = composition

  const [state, _setState] = useState<SequencerState>(initialState(composition))

  const { sectionStack, selectedLocation } = state

  const active = last(sectionStack)
  const section = active.section
  const beginning = active.beginning

  const prevPitch = useRef<Pitch>()

  const setState = (newState: SequencerState) => {
    const modulation = newState.selectedLocation ? 
      modulations.totalModulationAtPosition(globalPosition(newState)) : 
      1

    const elem = newState.selectedLocation?.block.element
    if (elem instanceof Pitch) {
      const freq = elem.ratio * modulation
      if (elem !== prevPitch.current) {
        playFreq(freq)
      }
      prevPitch.current = elem
    }

    _setState(newState)
  }

  useKeyPress((e) => {
    const newState = sequencerKeyBinds(e, composition, state)
    setState(newState)
    e.preventDefault()
  }, undefined, selectedLocation !== null)

  const sequencerRef = useRef<HTMLDivElement>(null)
  useClickOutside(sequencerRef, (e) => {
    setState(setSelected(state, null))
  })

  const blockHeight = 2.5 / section.minBlockDuration
  const editingBlockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    editingBlockRef.current?.scrollIntoView({block: 'center'})
  }, [selectedLocation])

  const renderTrack = (track: Track) => {
    const blocks: JSX.Element[] = []

    for (const chain of track.chains) {
      blocks.push(
        <div key={chain.id} className={style.chain} style={{top: `${chain.beginning * blockHeight}rem`}}>
          {chain.blocks.map(block => {
              const isSelected = selectedLocation && block === selectedLocation.block

              const props = {
                key: block.id,
                ref: isSelected ? editingBlockRef : undefined,
                className: cls(style.block, isSelected && common.selected),
                onClick: () => {
                  const loc = section.findBlock(block)!
                  if (loc.block === selectedLocation?.block && isSection(loc)) {
                    setState(drillIntoSection(state, loc))
                  } else {
                    setState(setSelected(state, loc))
                  }
                },
                style: {height: `${blockHeight * block.computedDuration}rem`}
              }

              return <div {...props}>
                {block.element instanceof Pitch && `${block.element.octave}, ${block.element.interval.toString()}`}
                {block.element instanceof Section && block.element.name}
                <Fraction numerator={block.duration.numerator} denominator={block.duration.denominator} />
              </div>
          })}
        </div>
      )
    }

    return blocks
  }

  return <div className={style.sequencer}>  
    <div className={style.section} ref={sequencerRef} style={{height: `${section.duration * blockHeight}rem`}}>

      <div className={style.tracks}>
        {section.tracks.map((track, trackIndex) => {
          return <div key={trackIndex} className={style.track}>
            {renderTrack(track)}
          </div>
        })}
      </div>

      <div className={style.modulations}>
        {mapIter(modulations.modulationsBetween(beginning, beginning + active.tempo * section.duration), (m, i) => {
          const position = (m.position - beginning) / active.tempo
          return <div key={i} className={style.modulation} style={{top: `${blockHeight * position}rem`}}>
            {m.interval.numerator} / {m.interval.denominator}
          </div>
        })}
      </div>
    </div>
    {/* <div>
      <button className={common.primary} onClick={() => composition.play()}>Play</button>
    </div> */}
  </div>
}