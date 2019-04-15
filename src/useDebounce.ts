import { useEffect } from 'react'

function useDebounce(fn: () => any, ms?: number): void
function useDebounce<A>(fn: (a: A) => any, ms: number, args: [A]): void
function useDebounce<A, B>(
  fn: (a: A, b: B) => any,
  ms: number,
  args: [A, B],
): void
function useDebounce<A, B, C>(
  fn: (a: A, b: B, c: C) => any,
  ms: number,
  args: [A, B, C],
): void
function useDebounce<A, B, C, D>(
  fn: (a: A, b: B, c: C, d: D) => any,
  ms: number,
  args: [A, B, C, D],
): void
function useDebounce<A, B, C, D, E>(
  fn: (a: A, b: B, c: C, d: D, e: E) => any,
  ms: number,
  args: [A, B, C, D, E],
): void
function useDebounce(fn: (...args: any) => any, ms: number, args: any[]): void
function useDebounce(
  fn: (...args: any) => any,
  ms: number = 1000,
  args: any[] = [],
) {
  useEffect(() => {
    let handle = setTimeout(fn.bind(null, ...args), ms)

    return () => {
      // if args change then clear timeout
      clearTimeout(handle)
    }
  }, args)
}

export default useDebounce
