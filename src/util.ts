// ---------------
// Math functions
// ---------------
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

// ---------------
// array functions
// ---------------
export function randomElement<T> (array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function shuffleArray<T> (array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    swap(array, i, j)
  }
}

export function deleteElem<T> (array: T[], elem: T) {
  array.splice(array.indexOf(elem), 1)
}

export function findClosest<T> (
    array: T[], target: number, iteratee: (elem: T) => number) {
  return array.reduce((closest, value) => {
    const distance = Math.abs(iteratee(value) - target)
    if (distance < closest.distance) {
      closest.distance = distance
      closest.value = value
    }
    return closest
  }, { value: array[0], distance: Infinity }).value
}

// ---------------
// object functions
// ---------------
export function swap (obj: Record<any, any>, i: number, j: number) {
  const t = obj[i]
  obj[i] = obj[j]
  obj[j] = t
}

export function sortByProp<T> (array: T[], prop: keyof T, reverse = false) {
  const order = reverse ? -1 : 1
  array.sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1 * order
    } else if (a[prop] > b[prop]) {
      return 1 * order
    } else {
      return 0
    }
  })
}

export function isEqual<T extends Record<any, any>> (a: T, b: T): boolean {
  for (const key of Object.keys(a)) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export function copy<T> (source: T): T {
  const copy = Object.create(Object.getPrototypeOf(source))
  Object.assign(copy, source)
  return copy
}

// ---------------
// other functions
// ---------------

export function mapIter<T, U> (
    iterable: Iterable<T>, mapFn: (x: T, index: number) => U) {
  const array: U[] = []
  let i = 0
  for (const x of iterable) {
    array.push(mapFn(x, i++))
  }
  return array
}

export function getAndDelete<T, U> (map: Map<T, U>, key: T): U | undefined {
  const value = map.get(key)
  map.delete(key)
  return value
}

export function removeChildren (node: Node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

export function numToPixel (num: number) {
  return Math.round(num).toString()
}
