export default function makeDraggable (
    element: HTMLElement, onDrag: (e: PointerEvent) => void) {

  function down () {
    document.body.addEventListener('pointermove', onDrag)

    window.addEventListener('pointerup', () => {
      document.body.removeEventListener('pointermove', onDrag)
    }, { once: true })
  }

  element.addEventListener('pointerdown', down)

  return () => {
    element.removeEventListener('pointerdown', down)
  }
}