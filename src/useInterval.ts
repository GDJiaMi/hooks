import { useState, useEffect } from 'react'

export interface UseIntervalOptions {
  startImmediate?: boolean
  duration?: number
  callback?: (count: number) => void
}

export default function useInterval({
  startImmediate,
  callback,
  duration,
}: UseIntervalOptions) {
  const [count, updateCount] = useState(0)
  const [intervalState, setIntervalState] = useState(
    startImmediate === undefined,
  )
  const [intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(
    () => {
      if (intervalState) {
        const intervalId = setInterval(() => {
          updateCount(count + 1)
          callback && callback(count)
        }, duration)
        setIntervalId(intervalId)
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
          setIntervalId(null)
        }
      }
    },
    [intervalState, count],
  )

  return {
    intervalId,
    state: intervalState,
    start: () => {
      setIntervalState(true)
    },
    stop: () => {
      setIntervalState(false)
    },
  }
}
