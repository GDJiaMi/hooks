import { useRef, useCallback } from "react";

export default function useInstance<T extends object>(
  initial: T
): [T, (value: Partial<T>) => void] {
  const ref = useRef<T>(initial || {});

  const update = useCallback<(value: Partial<T>) => void>(value => {
    for (let key in value) {
      // @ts-ignore
      ref.current[key] = value[key];
    }
  }, []);

  return [ref.current, update];
}
