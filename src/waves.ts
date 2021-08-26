function initWaveformBuffer(length = 32) {
  return new AudioBuffer({
    length,
    sampleRate: length * 440
  })
}

function makeSquareWave() {
  const buffer = initWaveformBuffer()

  const d = buffer.getChannelData(0)

  for (let i = 0; i < d.length / 4; i++) {
    d[i] = -0.5
  }

  for (let i = Math.ceil(d.length / 4); i < d.length; i++) {
    d[i] = 0.5
  }

  return buffer
}

export const squareWave = makeSquareWave()