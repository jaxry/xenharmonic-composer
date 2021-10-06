export default function useClickOutside(callback: () => void) {
  let clicked = false
  return {
    clickInside() {
      clicked = true
    },
    clickOutside() {
      if (!clicked) {
        callback()
      }
      clicked = false
    }
  }
}