import { useEffect } from 'react'

/**
 * 更好理解的React组件生命周期hook
 * @param lifeCycles
 */
export default function useLifeCycles(lifeCycles: {
  onMount?: () => any
  onUnMount?: () => any
  onUpdate?: (() => any) | [() => any, ...any[]]
}) {
  useEffect(() => {
    if (lifeCycles.onMount) {
      lifeCycles.onMount()
    }

    return () => {
      if (lifeCycles.onUnMount) {
        lifeCycles.onUnMount()
      }
    }
  }, [])

  useEffect(() => {
    if (lifeCycles.onUpdate) {
      if (typeof lifeCycles.onUpdate === 'function') {
        lifeCycles.onUpdate()
      } else {
        lifeCycles.onUpdate[0]()
      }
    }
  }, lifeCycles.onUpdate && (typeof lifeCycles.onUpdate === 'function' ? undefined : lifeCycles.onUpdate.slice(1)))
}
