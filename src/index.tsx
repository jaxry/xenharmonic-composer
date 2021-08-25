import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MusicPlayer from './MusicPlayer'
import App from './ui/App'

export const musicPlayer = new MusicPlayer()

export function renderUI() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// example of how to load audio samples
// fetch(new Request('./harp.wav'))
//   .then(response => response.arrayBuffer())
//   .then(buffer => musicPlayer.loadSample(buffer))

renderUI()
