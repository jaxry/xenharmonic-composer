import { RefObject, useEffect } from 'react'

export default function useClickOutside(ref: RefObject<HTMLElement>, callback: (e: MouseEvent) => void) {
  useEffect(() => {
    const target = ref.current

    if (!target) {
      return
    }

    let clicked = false

    const onTargetClick = () => {
      clicked = true
    }

    const onDocumentClick = (e: MouseEvent) => {
      if (!clicked) {
        callback(e)
      }
      clicked = false
    }

    document.addEventListener('click', onDocumentClick)
    target.addEventListener('click', onTargetClick)

    return () => {
      document.removeEventListener('click', onDocumentClick)
      target.removeEventListener('click', onTargetClick)
    }
  }, [ref, callback])
}