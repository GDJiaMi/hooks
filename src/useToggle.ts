import { useState, useCallback } from "react";

/**
 * 提供开关属性
 * @param defaultValue
 */
export default function useToggle(
  defaultValue?: boolean,
  adapter: (
    defaultValue?: boolean
  ) => [
    boolean | undefined,
    (cb: (value: boolean | undefined) => boolean) => void,
    ...any[]
  ] = useState
): [boolean | undefined, () => void] {
  const [value, setValue] = adapter(defaultValue);

  return [
    value,
    useCallback(() => {
      setValue(v => !v);
    }, [])
  ];
}
