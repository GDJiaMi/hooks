import { useEffect } from 'react'

export default function useOnMount(fn: Function) {
  useEffect(() => {
    fn()
  }, [])
}
