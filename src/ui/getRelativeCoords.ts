export default function getRelativeCoords (
    element: HTMLElement, e: MouseEvent) {
  const rect = element.getBoundingClientRect()
  return {
    x: e.clientX - rect.x,
    y: e.clientY - rect.y,
  }
}