import { useState, useCallback } from "react";

/**
 * 提供开关属性
 * @param defaultValue
 */
export default function useToggle(
  defaultValue?: boolean
): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue || false);

  return [
    value,
    useCallback(() => {
      setValue(v => !v);
    }, [])
  ];
}
