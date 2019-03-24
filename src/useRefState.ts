import {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
  MutableRefObject,
} from 'react'

/**
 * 扩展useState，新增了getValue作为第三个参数，可以用于在被缓存的callback中获取到最新的值
 *
 * 在闭包环境，有时候为了性能问题，会使用useCallback缓存回调函数，如果在这个回调函数中依赖外部的
 * 状态，就会导致问题，它会缓存会回调创建时的环境。也就是依赖的外部变量是旧的
 */
export default function useRefState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  const ins = useRef() as MutableRefObject<S>

  const [state, setState] = useState<S>(() => {
    // 初始化
    const value =
      typeof initialState === 'function'
        ? (initialState as () => S)()
        : initialState
    ins.current = value
    return value
  })

  const setValue = useCallback((value: SetStateAction<S>) => {
    if (typeof value === 'function') {
      setState(prevState => {
        const finalValue = (value as ((prevState: S) => S))(prevState)
        ins.current = finalValue
        return finalValue
      })
    } else {
      ins.current = value
      setState(value)
    }
  }, [])

  return [state, setValue, ins]
}
