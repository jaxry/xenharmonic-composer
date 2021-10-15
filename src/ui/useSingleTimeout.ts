export default function useSingleTimeout() {
  let timer: NodeJS.Timer
  return (callback?: () => void, delay = 0) => {
    clearTimeout(timer)
    if (callback) {
      timer = setTimeout(callback, delay)
    }
  }
}