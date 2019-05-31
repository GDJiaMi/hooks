import { useState, useCallback, Dispatch, SetStateAction } from 'react'

/**
 * 在SessionStorage或LocalStorage获取和保存值
 *
 * @param key
 * @param keepOnWindowClosed
 * @param clear
 */
export default function useSession<T>(
  key: string,
  keepOnWindowClosed: boolean = false,
  defaultValue?: T | (() => T),
): [T | undefined, Dispatch<SetStateAction<T>>, () => void] {
  const storage = keepOnWindowClosed ? localStorage : sessionStorage

  const getStorageValue = () => {
    try {
      const storageValue = storage.getItem(key)
      if (storageValue != null) {
        return JSON.parse(storageValue)
      } else if (defaultValue) {
        const value =
          typeof defaultValue === 'function'
            ? (defaultValue as () => T)()
            : defaultValue
        storage.setItem(key, JSON.stringify(value))
        return value
      }
    } catch (err) {
      console.warn(`useSession 无法获取${key}: `, err)
    }

    return undefined
  }

  const [value, setValue] = useState<T | undefined>(getStorageValue)
  const save = useCallback<Dispatch<SetStateAction<T>>>(value => {
    setValue(prev => {
      const finalValue =
        typeof value === 'function'
          ? (value as (prev: T | undefined) => T)(prev)
          : value
      storage.setItem(key, JSON.stringify(finalValue))
      return finalValue
    })
  }, [])

  const clear = useCallback(() => {
    storage.removeItem(key)
    setValue(undefined)
  }, [])

  return [value, save, clear]
}
