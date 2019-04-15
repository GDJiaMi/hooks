import { useState, useCallback } from 'react'
import useRefProps from './useRefProps'
import useRefState from './useRefState'
import useOnUnmount from './useOnUnmount'
import useInstance from './useInstance'
import { useOnUpdate } from './useOnUpdate'

export interface UsePollOptions<T> {
  /**
   * determinate should continue poll
   * @param arg poller return value
   */
  condition: (arg?: T, error?: Error) => Promise<boolean>
  /**
   * poll action
   */
  poller: () => Promise<T>
  onError?: (err: Error) => void
  /**
   * poll duration. default is 5000
   */
  duration?: number
  /**
   * ignore poller's error. default is false
   */
  ignoreError?: boolean
  /**
   * watching arguments. when these arguments change, usePoll will recheck condition
   */
  args?: any[]
  /**
   * poll immediately, default is false
   */
  immediately?: boolean
}

/**
 * 实现页面轮询机制
 */
export default function usePoll<T = any>(options: UsePollOptions<T>) {
  const [polling, setPolling, pollingRef] = useRefState(false)
  const [error, setError] = useState<Error>()
  const [state] = useInstance<{ timer?: number; unmounted?: boolean }>({})
  const optionsRef = useRefProps(options)

  const poll = useCallback(async (immediate?: boolean) => {
    /**
     * 已经卸载，或其他轮询器正在轮询
     */
    if (state.unmounted || pollingRef.current) {
      return
    }

    setPolling(true)
    state.timer = window.setTimeout(
      async () => {
        if (state.unmounted) {
          return
        }

        try {
          let res: T | undefined
          let error: Error | undefined
          setError(undefined)

          try {
            res = await optionsRef.current.poller()
          } catch (err) {
            console.warn(`[usePoll] poll error`, err)
            error = err
            setError(err)
            if (optionsRef.current.onError) {
              optionsRef.current.onError(err)
            }

            if (!optionsRef.current.ignoreError) {
              return
            }
          }

          if (
            !state.unmounted &&
            (await optionsRef.current.condition(res, error))
          ) {
            setTimeout(poll)
          }
        } finally {
          !state.unmounted && setPolling(false)
        }
      },
      immediate ? 0 : optionsRef.current.duration || 5000,
    )
  }, [])

  useOnUpdate(
    async () => {
      if (pollingRef.current) {
        return
      }

      // setup
      if (await optionsRef.current.condition()) {
        poll(options.immediately)
      }
    },
    options.args || [],
    false,
  )

  useOnUnmount(() => {
    window.clearTimeout(state.timer)
    state.unmounted = true
  })

  return { polling, error }
}
