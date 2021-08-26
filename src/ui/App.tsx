import React from 'react'
import Composition from '../composition/Composition'
import style from './App.module.css'
import IntervalEditor from './IntervalEditor'
import Sequencer from './Sequencer'
import Tabs from './Tabs'

const composition = new Composition()

export default function App() {
  // const synth = useKeyboardSynth(composition.intervals)

  return <main className={style.app}>
    <Tabs entries={[
      {name: 'Sequencer', content: <Sequencer composition={composition} />},
      {name: 'Scale Editor', content: <IntervalEditor composition={composition}></IntervalEditor>},
    ]}/>
  </main>
}