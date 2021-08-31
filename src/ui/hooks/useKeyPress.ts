import { useEffect } from 'react'

export default function useKeyPress(keyDown: (e: KeyboardEvent) => void, keyUp?: (e: KeyboardEvent) => void, enable = true) {
  useEffect(() => {
    if (!enable) {
      return
    }

    window.addEventListener('keydown', keyDown)
    if (keyUp) {
      window.addEventListener('keyup', keyUp)
    }

    return () => {
      window.removeEventListener('keydown', keyDown)
      if (keyUp) {
        window.removeEventListener('keyup', keyUp)
      }
    }
  }, [keyDown, keyUp, enable])
}