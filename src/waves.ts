function initWaveformBuffer(length = 24) {
  return new AudioBuffer({
    length,
    sampleRate: length * 440
  })
}

function makeWave(waveFn: (x: number) => number) {
  const buffer = initWaveformBuffer()

  const d = buffer.getChannelData(0)

  for (let i = 0; i < d.length; i++) {
    d[i] = waveFn(i / d.length)
  }

  return buffer
}

function squareFn(x: number) {
  return x % 1 < 0.25 ? 0 : 1
}

// function sawFn(x: number) {
//   return x % 1
// }

// function sinFn(x: number) {
//   return Math.sin((x % 1) * 2 * Math.PI) * 0.5 + 0.5
// }

// function triangleFn(x: number) {
//   return 2 * Math.abs((x % 1) - Math.floor((x % 1) + 0.5))
// }

export const squareWave = makeWave(squareFn)

