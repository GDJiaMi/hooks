import { useState, useCallback } from 'react'
import useRefProps from './useRefProps'
import useRefState from './useRefState'

export interface Res<T, S> {
  loading: boolean
  error?: Error
  value?: S
  setValue: (v: S) => void
  call: T
  reset: () => void
}

export interface UsePromiseOptions {
  skipWhenLoading?: boolean
}

function usePromise<T>(
  action: () => Promise<T>,
  option?: UsePromiseOptions,
): Res<() => Promise<T>, T>
function usePromise<T, A>(
  action: (arg0: A) => Promise<T>,
  option?: UsePromiseOptions,
): Res<(arg0: A) => Promise<T>, T>
function usePromise<T, A, B>(
  action: (arg0: A, arg1: B) => Promise<T>,
  option?: UsePromiseOptions,
): Res<(arg0: A, arg1: B) => Promise<T>, T>
function usePromise<T, A, B, C>(
  action: (arg0: A, arg1: B, arg2: C) => Promise<T>,
  option?: UsePromiseOptions,
): Res<(arg0: A, arg1: B, arg2: C) => Promise<T>, T>
function usePromise<T, A, B, C, D>(
  action: (arg0: A, arg1: B, arg2: C, arg3: D) => Promise<T>,
  option?: UsePromiseOptions,
): Res<(arg0: A, arg1: B, arg2: C, arg3: D) => Promise<T>, T>
function usePromise<T, A, B, C, D, E>(
  action: (arg0: A, arg1: B, arg2: C, arg3: D, arg4: E) => Promise<T>,
  option?: UsePromiseOptions,
): Res<(arg0: A, arg1: B, arg2: C, arg3: D, arg4: E) => Promise<T>, T>
function usePromise(
  action: (...args: any[]) => Promise<any>,
  option?: UsePromiseOptions,
): Res<(...args: any) => Promise<any>, any>
function usePromise(
  action: (...args: any[]) => Promise<any>,
  option: UsePromiseOptions = { skipWhenLoading: true },
): Res<(...args: any) => Promise<any>, any> {
  const actionRef = useRefProps(action)
  const optionRef = useRefProps(option)
  const [loading, setLoading, loadingRef] = useRefState(false)
  const [value, setValue] = useState()
  const [error, setError] = useState<Error | undefined>()

  const caller = useCallback(async (...args: any[]) => {
    try {
      if (loadingRef.current && optionRef.current.skipWhenLoading) {
        return
      }

      setLoading(true)
      setError(undefined)
      const res = await actionRef.current(...args)
      if (!loadingRef.current) {
        return
      }
      setValue(res)
      return res
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setValue(undefined)
    setError(undefined)
  }, [])

  return { loading, error, call: caller, value, setValue, reset }
}

export default usePromise
