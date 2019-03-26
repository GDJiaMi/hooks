import { useEffect } from 'react'
import useRefProps from './useRefProps'

export interface UseLifeCyclesOption {
  onMount?: () => any
  onUnmount?: () => any
  onUpdate?: (() => any) | [() => any, ...any[]]
}

/**
 * 更好理解的React组件生命周期hook
 * @param options
 */
export default function useLifeCycles(options: UseLifeCyclesOption) {
  const optionsRef = useRefProps(options)
  useEffect(() => {
    if (optionsRef.current.onMount) {
      optionsRef.current.onMount()
    }

    return () => {
      if (optionsRef.current.onUnmount) {
        optionsRef.current.onUnmount()
      }
    }
  }, [])

  useEffect(() => {
    if (optionsRef.current.onUpdate) {
      if (typeof optionsRef.current.onUpdate === 'function') {
        optionsRef.current.onUpdate()
      } else {
        optionsRef.current.onUpdate[0]()
      }
    }
  }, options.onUpdate && (typeof options.onUpdate === 'function' ? undefined : options.onUpdate.slice(1)))
}
