import { Dispatch, useEffect, useState } from 'react'

const table: Record<string, any> = {}

export default function usePersistentState<S>(initialState: S | (() => S), key: string): [S, Dispatch<S>] {
  const tuple = useState(table[key] || initialState)

  useEffect(() => {
    table[key] = tuple[0]
  })

  return tuple
}