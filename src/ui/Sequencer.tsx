import { useEffect, useRef, useState } from 'react'
import sequencerKeyBinds from './sequencerKeyBinds'
import Composition from '../composition/Composition'
import Track from "../composition/Track"
import Pitch from '../Pitch'
import { last, mapIter } from '../util'
import useClickOutside from './hooks/useClickOutside'
import useKeyPress from './hooks/useKeyPress'
import common from './common.module.css'
import style from './Sequencer.module.css'
import { globalPosition, initialState, selectBlock, selectSection, SequencerState, setSelected } from './SequencerState'
import { playFreq } from '../play'
// import shiftPitch from '../operations/shiftPitch'
// import useWheel from './hooks/useWheel'
import BlockComponent from './BlockComponent'
import SectionName from './SectionName'
import SectionSelect from './SectionSelect'

export default function Sequencer(props: { composition: Composition }) {
  const { composition } = props
  const { modulations } = composition

  const [state, _setState] = useState<SequencerState>(initialState(composition))

  const previewPitch = usePreviewPitch(composition)

  const setState = (newState: SequencerState) => {
    previewPitch(newState)
    _setState(newState)
  }

  const { selectedLocation } = state

  const active = last(state.sectionStack)
  const { section, beginning } = active

  useKeyPress((e) => {
    const newState = sequencerKeyBinds(e, composition, state)
    if (newState !== state) {
      setState(newState)
    }
  }, undefined)

  // const onWheel = useWheel((delta) => {
  //   if (!selectedLocation) {
  //     return
  //   }
  //   shiftPitch(selectedLocation?.block, composition.intervals, delta)
  //   setState({...state})
  // })

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
    return track.chains.map(chain => {
      return  <div key={chain.id} className={style.chain} style={{top: `${chain.beginning * blockHeight}rem`}}>
      {chain.blocks.map(block => {
        const isSelected = (selectedLocation && block === selectedLocation.block) || false
        const blockComponent = <BlockComponent
          key={block.id}
          block={block} 
          blockHeight={blockHeight} 
          isSelected={isSelected} 
          onClick={() => setState(selectBlock(state, block))} 
          ref={isSelected ? editingBlockRef : undefined}
        />

        if (state.showSectionSelect && isSelected) {
          return <div className={common.relative} key={block.id}>
            <SectionSelect 
              composition={composition} 
              onSelect={(selectedSection) => setState(selectSection(state, section.findBlock(block)!, selectedSection))}
             />
            {blockComponent}
          </div>
        } else {
          return blockComponent
        }
      })}
    </div>
    })
  }

  return <div className={style.sequencer}>
    <SectionName composition={composition} section={section} />
    <div className={style.section}>
      <div className={style.tracks} ref={sequencerRef}>
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

function usePreviewPitch(composition: Composition) {
  const prevPitch = useRef<Pitch>()

  return (newState: SequencerState) => {
    const elem = newState.selectedLocation?.block.element
    if (elem instanceof Pitch) {
      const modulation = composition.modulations.totalModulationAtPosition(globalPosition(newState))

      const freq = elem.ratio * modulation
      if (elem !== prevPitch.current) {
        playFreq(freq)
      }
      prevPitch.current = elem
    }
  }
}