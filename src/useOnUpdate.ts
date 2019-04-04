import { useEffect, useRef } from 'react'
import useRefProps from './useRefProps'

function useOnUpdate(fn: () => any, args?: any[], skipOnMount?: boolean): void
function useOnUpdate<A>(
  fn: (a: A) => any,
  args: [A],
  skipOnMount?: boolean,
): void
function useOnUpdate<A, B>(
  fn: (a: A, b: B) => any,
  args: [A, B],
  skipOnMount?: boolean,
): void
function useOnUpdate<A, B, C>(
  fn: (a: A, b: B, c: C) => any,
  args: [A, B, C],
  skipOnMount?: boolean,
): void
function useOnUpdate<A, B, C, D>(
  fn: (a: A, b: B, c: C, d: D) => any,
  args: [A, B, C, D],
  skipOnMount?: boolean,
): void
function useOnUpdate<A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D, e: E) => any,
  args: [A, B, C, D, E],
  skipOnMount?: boolean,
): void
function useOnUpdate(
  fn: (...args: any[]) => any,
  args: any[] = [],
  skipOnMount: boolean = true,
) {
  const fnRef = useRefProps(fn)
  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current && skipOnMount) {
      mountedRef.current = true
      return
    }

    fnRef.current(...args)
  }, args)
}

export { useOnUpdate }
