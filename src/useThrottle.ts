import { useEffect } from 'react'
import useOnUnmount from './useOnUnmount'
import useInstance from './useInstance'

function useThrottle(fn: () => any, ms?: number): void
function useThrottle<A>(fn: (a: A) => any, ms: number, args: [A]): void
function useThrottle<A, B>(
  fn: (a: A, b: B) => any,
  ms: number,
  args: [A, B],
): void
function useThrottle<A, B, C>(
  fn: (a: A, b: B, c: C) => any,
  ms: number,
  args: [A, B, C],
): void
function useThrottle<A, B, C, D>(
  fn: (a: A, b: B, c: C, d: D) => any,
  ms: number,
  args: [A, B, C, D],
): void
function useThrottle<A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D, e: E) => any,
  ms: number,
  args: [A, B, C, D, E],
): void
function useThrottle(fn: (...args: any[]) => any, ms: number, args: any[]): void
function useThrottle(
  fn: (...args: any[]) => any,
  ms: number = 200,
  args: any[] = [],
) {
  const [state] = useInstance<{
    timeout?: number
    hasNext?: boolean
    nextArgs?: any[]
  }>({})

  useEffect(() => {
    if (state.timeout == null) {
      // first call
      fn(...args)

      const timeoutCallback = () => {
        if (state.hasNext) {
          state.hasNext = false
          fn(...state.nextArgs!)
          state.timeout = window.setTimeout(timeoutCallback, ms)
        } else {
          state.timeout = undefined
        }
      }

      state.timeout = window.setTimeout(timeoutCallback, ms)
    } else {
      state.nextArgs = args
      state.hasNext = true
    }
  }, args)

  useOnUnmount(() => {
    clearTimeout(state.timeout)
  })
}

export default useThrottle
