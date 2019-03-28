import { useState, useCallback } from 'react'

/**
 * 强制刷新
 */
export default function useUpdate() {
  const [, setValue] = useState(0)
  return useCallback(() => {
    setValue(val => (val + 1) % (Number.MAX_SAFE_INTEGER - 1))
  }, [])
}
