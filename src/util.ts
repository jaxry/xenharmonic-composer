export function mod(x: number, n: number) {
  return ((x % n) + n) % n
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x))
}

export function last<T>(a: T[]): T {
  return a[a.length - 1]
}

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function swap(obj: Record<any, any>, i: number, j: number) {
  const t = obj[i]
  obj[i] = obj[j]
  obj[j] = t
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    swap(array, i, j)
  }
}

export function isEqual<T extends Record<any, any>>(a: T, b: T): boolean {
  for (const key of Object.keys(a)) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export function copy<T>(source: T) {
  const copy = Object.create(Object.getPrototypeOf(source))
  Object.assign(copy, source)
  return copy
}

export function mapIter<T, U>(iterable: Iterable<T>, mapFn: (x: T, index: number) => U) {
  const array: U[] = []
  let i = 0
  for (const x of iterable) {
    array.push(mapFn(x, i++))
  }
  return array
}

export function animate(time: number, callback: (percent: number) => void) {
  const startingTime = Date.now()

  const tick = () => {
    const elapsed = Date.now() - startingTime
    const percentCompleted = Math.min(elapsed / time, 1)
    callback(percentCompleted)
    if (Date.now() - startingTime < time) {
      requestAnimationFrame(tick)
    }
  }

  tick()
}

export function throttle<T>(fn: (...args: T[]) => void): (...args: T[]) => void {
  let wait = false


  const stopWait = () => {
    wait = false
  }

  return (...args: T[]) => {
    if (wait) {
      return
    }
    
    fn(...args)

    wait = true
    requestAnimationFrame(stopWait)
  }
}

export function cls(...styles: Array<any>) {
  let str = ''
  for (const style of styles) {
    if (typeof style === 'string') {
      str += style + ' '
    }
  }
  return str
}
