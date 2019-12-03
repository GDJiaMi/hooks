import { useCallback, useState } from 'react'

/**
 * 用于原生 HTML 表单的双向绑定
 * @param initialValue 初始值
 */
export default function useInput(initialValue?: string, options?: {}) {
  const [value, setValue] = useState(initialValue)
  const onChange = useCallback<React.ChangeEventHandler<{ value: any }>>(e => {
    setValue(e.currentTarget.value)
  }, [])

  return { input: { onChange, value }, value, setValue, onChange }
}
