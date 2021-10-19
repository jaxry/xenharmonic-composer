import { onDestroy } from "svelte";
import { readable, Subscriber } from "svelte/store";

export default function useEvent<T>(initial: T) {
  let _emit: (x: T) => void
  
  const event = readable(initial, (set) => {
    _emit = set
  })

  function subscribe(callback: (x: T) => void) {
    const unsubscribe = event.subscribe(callback)
    onDestroy(unsubscribe)
    return unsubscribe
  }

  return {
    subscribe,
    emit: (x: T) => _emit?.(x)
  }
}
