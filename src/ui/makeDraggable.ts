import throttle from './throttle'

export default function makeDraggable (
    element: Element,
    onDrag: (e: MouseEvent, movementX: number, movementY: number) => void,
    options?: {
      onDown?: (e: MouseEvent) => void,
      onUp?: (e: MouseEvent) => void,
      enableWhen?: (e: MouseEvent) => boolean,
      startEnabled?: MouseEvent
    }) {

  let lastX = 0
  let lastY = 0

  function down (e: MouseEvent) {
    if (options?.enableWhen?.(e) === false) {
      return
    }
    options?.onDown?.(e)

    e.preventDefault()

    lastX = e.clientX
    lastY = e.clientY

    document.body.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up, { once: true })
  }

  // throttle the mousemove event to the browser's requestAnimationFrame
  // otherwise even gets triggered way more than necessary
  const move = throttle((e: MouseEvent) => {
    const movementX = e.clientX - lastX
    const movementY = e.clientY - lastY
    onDrag(e, movementX, movementY)
    lastX = e.clientX
    lastY = e.clientY
  })

  function up (e: MouseEvent) {
    document.body.removeEventListener('mousemove', move)
    options?.onUp?.(e)
  }

  (element as HTMLElement).addEventListener('mousedown', down)

  if (options?.startEnabled) {
    const event = options.startEnabled
    setTimeout(() => down(event))
  }

  return () => {
    (element as HTMLElement).removeEventListener('mousedown', down)
  }
}