import { useState, useCallback } from "react";

/**
 * 强制刷新
 */
export default function useUpdate() {
  const [, setValue] = useState(0);
  return useCallback(() => {
    setValue(val => val % (Number.MAX_SAFE_INTEGER - 1));
  }, []);
}
