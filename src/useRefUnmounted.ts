import { useRef, useEffect } from 'react'

/**
 * 检查是否已经卸载，如果组件在执行异步操作，应该判断当前组件是否卸载
 */
export default function useRefUnmounted() {
  const ref = useRef<boolean>(false)
  useEffect(() => {
    return () => {
      ref.current = true
    }
  }, [])

  return ref
}
