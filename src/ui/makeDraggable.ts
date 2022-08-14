import throttle from './throttle'

export default function makeDraggable (
    element: HTMLElement,
    onDrag: (e: PointerEvent, movementX: number, movementY: number) => void,
    onDown?: (e: PointerEvent) => void | false, onUp?: (e: PointerEvent) => void) {

  let lastX = 0
  let lastY = 0

  function down (e: PointerEvent) {
    if (onDown?.(e) === false) {
      return
    }

    e.preventDefault()
    lastX = e.clientX
    lastY = e.clientY
    document.body.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
  }

  const move = throttle((e: PointerEvent) => {
    const movementX = e.clientX - lastX
    const movementY = e.clientY - lastY
    onDrag(e, movementX, movementY)
    lastX = e.clientX
    lastY = e.clientY
  })

  function up (e: PointerEvent) {
    document.body.removeEventListener('pointermove', move)
    onUp?.(e)
  }

  element.addEventListener('pointerdown', down)

  return () => {
    element.removeEventListener('pointerdown', down)
  }
}