export function mod (x: number, n: number) {
  return ((x % n) + n) % n
}

export function clamp (x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x))
}

export function lerp (
    x0: number, x1: number, y0: number, y1: number, x: number) {
  return y0 + (x - x0) * (y1 - y0) / (x1 - x0)
}

export function lerpClamped (
    x0: number, x1: number, y0: number, y1: number, x: number) {
  return clamp(lerp(x0, x1, y0, y1, x), Math.min(y0, y1), Math.max(y0, y1))
}