import { useCallback, useState } from 'react'

export default function useInput(initialValue?: string) {
  const [value, setValue] = useState(initialValue)
  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      setValue(e.currentTarget.value)
    },
    [],
  )

  return { input: { onChange, value }, value, setValue, onChange }
}
