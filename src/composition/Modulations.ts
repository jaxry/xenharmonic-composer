import Interval from '../Interval'

export interface Modulation {
  position: number
  interval: Interval
}

export default class Modulations {
  list: Modulation[] = []

  ; *modulationsBetween(beginning: number, end: number) {
    for (const modulation of this.list) {
      if (modulation.position < beginning) {
        continue
      }
      if (modulation.position > end) {
        return
      }
      yield modulation
    }
  }

  totalModulationAtPosition(position: number) {
    let compounded = 1

    for (const modulation of this.list) {
      if (modulation.position > position) {
        break
      }
      compounded *= modulation.interval.quotient
    }
  
    compounded *= 2 ** Math.round(Math.log2(1 / compounded))
  
    return compounded
  }

  getModulationAtPosition(position: number) {
    for (const modulation of this.list) {
      if (modulation.position === position) {
        return modulation
      } else if (modulation.position > position) {
        return undefined
      }
    }
  }

  addAtPosition(position: number, interval: Interval) {
    const modulation = {
      position,
      interval
    }
  
    this.list.push(modulation)
    this.list.sort((a, b) => a.position - b.position)
    
    return modulation 
  }

  removeAtPosition(position: number) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].position === position) {
        this.list.splice(i, 1)
        return
      }
    }
  }
}

export function applyModulation(currentModulation: number, modulation: Modulation) {
  currentModulation *= modulation.interval.quotient
  currentModulation *= 2 ** Math.round(Math.log2(1 / currentModulation))
  return currentModulation
}