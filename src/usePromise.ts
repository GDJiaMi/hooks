import { useState, useCallback } from 'react'

export interface Res<T, S> {
  loading: boolean
  error?: Error
  value?: S
  setValue: (v: S) => void
  call: T
}

export default function usePromise<T>(
  action: () => Promise<T>,
  args?: any[],
): Res<() => Promise<T>, T>
export default function usePromise<T, A>(
  action: (arg0: A) => Promise<T>,
  args?: any[],
): Res<(arg0: A) => Promise<T>, T>
export default function usePromise<T, A, B>(
  action: (arg0: A, arg1: B) => Promise<T>,
  args?: any[],
): Res<(arg0: A, arg1: B) => Promise<T>, T>
export default function usePromise<T, A, B, C>(
  action: (arg0: A, arg1: B, arg2: C) => Promise<T>,
  args?: any[],
): Res<(arg0: A, arg1: B, arg2: C) => Promise<T>, T>
export default function usePromise<T, A, B, C, D>(
  action: (arg0: A, arg1: B, arg2: C, arg3: D) => Promise<T>,
  args?: any[],
): Res<(arg0: A, arg1: B, arg2: C, arg3: D) => Promise<T>, T> {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<T>()
  const [error, setError] = useState<Error | undefined>()

  const caller = useCallback(async (...args: any[]) => {
    try {
      setLoading(true)
      setError(undefined)
      // @ts-ignore
      const res = await action(...args)
      setValue(res)
      return res
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, args || [])

  return { loading, error, call: caller, value, setValue }
}
