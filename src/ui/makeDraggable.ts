import throttle from './throttle'

export default function makeDraggable (
    element: HTMLElement,
    onDrag: (e: PointerEvent, movementX: number, movementY: number) => void,
    options?: {
      onDown?: (e: PointerEvent) => void,
      onUp?: (e: PointerEvent) => void,
      enableWhen?: (e: PointerEvent) => boolean,
      startEnabled?: PointerEvent
    }) {

  let lastX = 0
  let lastY = 0

  function down (e: PointerEvent) {
    if (options?.enableWhen?.(e) === false) {
      return
    }
    options?.onDown?.(e)

    e.preventDefault()
    lastX = e.clientX
    lastY = e.clientY
    document.body.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
  }

  // throttle the mousemove event to the browser's requestAnimationFrame
  // otherwise even gets triggered way more than necessary
  const move = throttle((e: PointerEvent) => {
    const movementX = e.clientX - lastX
    const movementY = e.clientY - lastY
    onDrag(e, movementX, movementY)
    lastX = e.clientX
    lastY = e.clientY
  })

  function up (e: PointerEvent) {
    document.body.removeEventListener('pointermove', move)
    options?.onUp?.(e)
  }

  element.addEventListener('pointerdown', down)

  if (options?.startEnabled) {
    const event = options.startEnabled
    setTimeout(() => down(event))
  }

  return () => {
    element.removeEventListener('pointerdown', down)
  }
}