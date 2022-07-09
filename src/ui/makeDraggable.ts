export default function makeDraggable (
    element: HTMLElement, onDrag: (e: PointerEvent) => void,
    onDown?: (e: PointerEvent) => void, onUp?: (e: PointerEvent) => void) {

  function down (e: PointerEvent) {
    document.body.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', up, { once: true })

    onDown?.(e)
  }

  function up (e: PointerEvent) {
    document.body.removeEventListener('pointermove', onDrag)
    onUp?.(e)
  }

  element.addEventListener('pointerdown', down)

  return () => {
    element.removeEventListener('pointerdown', down)
  }
}