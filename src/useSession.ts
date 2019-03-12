import { useState, useCallback } from "react";

/**
 * 在SessionStorage或LocalStorage获取和保存值
 *
 * @param key
 * @param keepOnWindowClosed
 */
export default function useSession<T>(
  key: string,
  keepOnWindowClosed: boolean = false
): [T | null, (value: T) => void, () => void] {
  const storage = keepOnWindowClosed ? localStorage : sessionStorage;

  const getStorageValue = () => {
    try {
      const storageValue = storage.getItem(key);
      if (storageValue != null) {
        return JSON.parse(storageValue);
      }
    } catch (err) {
      console.warn(`useSession 无法获取${key}: `, err);
    }

    return null;
  };

  const [value, setValue] = useState<T | null>(getStorageValue);
  const save = useCallback((value: T) => {
    storage.setItem(key, JSON.stringify(value));
    setValue(value);
  }, []);

  const clear = useCallback(() => {
    storage.removeItem(key);
    setValue(null);
  }, []);

  return [value, save, clear];
}
