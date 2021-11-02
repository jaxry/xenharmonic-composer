import { onDestroy } from "svelte"
import { readable } from "svelte/store"

export default function useEvent<T>(initial?: T) {
  let emit: null | ((x: T) => void) = null
  
  const event = readable(initial, (set) => {
    emit = set
    return () => {
      emit = null
    }
  })

  function subscribe(callback: (x: T) => void) {
    const unsubscribe = event.subscribe(callback)
    onDestroy(unsubscribe)
    return unsubscribe
  }

  return {
    subscribe,
    emit: (x: T) => emit?.(x)
  }
}
