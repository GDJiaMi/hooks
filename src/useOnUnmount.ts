import { useEffect } from 'react'
import useRefProps from './useRefProps'

export default function useOnUnmount(fn: Function) {
  const fnRef = useRefProps(fn)

  useEffect(() => {
    return () => {
      if (fnRef.current) {
        fnRef.current()
      }
    }
  }, [])
}
