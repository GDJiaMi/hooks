import { useEffect } from 'react'
import useRefProps from './useRefProps'

export default function useOnUpdate(fn: Function, ...args: any[]) {
  const fnRef = useRefProps(fn)
  useEffect(
    () => {
      fnRef.current()
    },
    args.length ? args : [],
  )
}
