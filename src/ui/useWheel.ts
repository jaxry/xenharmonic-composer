// slow down wheel events on track pad.
// each movement on a trackpad gives a deltaY of 1,
// each movement of a wheel gives a deltaY of > 4
export default function useWheel(callback: (e: WheelEvent, delta: 0 | 1 | -1) => void) {
  let wheelDelta = 0

  return (e: WheelEvent) => {
    wheelDelta += Math.abs(e.deltaY)
    if (wheelDelta > 4) {
      wheelDelta = 0
      callback(e, -Math.sign(e.deltaY) as 1 | -1)
    } else {
      callback(e, 0)
    }
  }
}