/* tslint:disable:no-any */
import { useEffect, useState, useCallback } from 'react'

/**
 * 在组件挂载时执行异步操作
 * @deprecated
 */
export default function useAsyncOnMount<T>(
  fn: (() => Promise<T | undefined>),
  inputs: any[] = [],
) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [value, setValue] = useState<T | undefined>(undefined)
  const [retryCount, forceRetry] = useState(0)

  const retry = useCallback(() => {
    forceRetry(s => s + 1)
  }, [])

  useEffect(
    () => {
      setError(undefined)
      setLoading(true)

      fn().then(
        val => {
          setValue(val)
          setLoading(false)
        },
        err => {
          setLoading(false)
          setError(err)
        },
      )
    },
    [retryCount, ...inputs],
  )

  return { loading, error, value, retry, refetch: retry, setValue }
}
