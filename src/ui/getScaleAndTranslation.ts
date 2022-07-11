export default function getScaleAndTranslation (matrix: DOMMatrix) {
  return {
    sx: matrix.a,
    sy: matrix.d,
    tx: matrix.e,
    ty: matrix.f,
  }
}