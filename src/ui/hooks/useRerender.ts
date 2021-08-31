import { useReducer } from 'react'

export default function useRerender() {
  const [, rerender] = useReducer(i => i + 1, 0)
  return rerender
}