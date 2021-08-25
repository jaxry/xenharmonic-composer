export default function computeGcd(a: number, b: number) {
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}