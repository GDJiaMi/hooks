import { useCallback, useState } from "react";

export default function useInput<T = string>(initialValue?: T) {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(
    (e: React.ChangeEvent<{ value: T }>) => setValue(e.target.value),
    []
  );

  return { input: { onChange, value }, value, setValue, onChange };
}
