import { useEffect, useCallback, useState } from 'react'
import useInstance from './useInstance'

export interface UseTimeoutOption {
  duration?: number
  startOnMount?: boolean
  callback?: Function
}

export default function useTimeout(options: UseTimeoutOption = {}) {
  const [ready, setReady] = useState(false)
  const [state] = useInstance<{ timer?: number; unmounted?: boolean }>({})

  const start = useCallback(
    () => {
      if (state.unmounted) {
        return
      }

      setReady(false)
      window.clearTimeout(state.timer)

      state.timer = window.setTimeout(() => {
        setReady(true)
        options.callback && options.callback()
      }, options.duration)
    },
    [options.callback, options.duration],
  )

  const stop = useCallback(() => {
    setReady(false)
    window.clearTimeout(state.timer)
  }, [])

  useEffect(() => {
    if (options.startOnMount) {
      start()
    }

    return () => {
      window.clearTimeout(state.timer)
      state.unmounted = true
    }
  }, [])

  return { start, stop, ready }
}
