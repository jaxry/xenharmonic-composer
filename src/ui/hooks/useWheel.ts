import React, { useRef } from "react"

// slow down wheel events on track pad.
// each movement on a trackpad gives a deltaY of 1,
// each movement of a wheel gives a deltaY of > 4
export default function useWheel(callback: (delta: 1 | -1) => void) {
  const wheelDelta = useRef(0)
  return (e: React.WheelEvent) => {
      wheelDelta.current += Math.abs(e.deltaY)
      if (wheelDelta.current > 4) {
        wheelDelta.current = 0
        callback(Math.sign(e.deltaY) as 1 | -1)
      }
  }
}