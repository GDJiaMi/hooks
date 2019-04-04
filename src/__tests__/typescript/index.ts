import { useOnUpdate, usePromise, useDebounce, useThrottle } from '../../index'

it('test useOnUpdate call signature', () => {
  useOnUpdate(() => {})
  useOnUpdate(() => {}, [1, 2])
  useOnUpdate(() => {}, [1, 2, 3])
  useOnUpdate(() => {}, [1, 2, 3, 4])
  useOnUpdate(() => {}, [1, 2, 3, 4, 5])
  useOnUpdate(() => {}, [1, 2, 3, 4, 5, 6])
})

it('test usePromise call signature', () => {
  usePromise(async () => {})
  usePromise(async () => 1)
  usePromise(async (a: number) => 1)
  usePromise(async (a: number, b: number) => 1)
  usePromise(async (a: number, b: number, c: string) => 1)
  usePromise(async (a: number, b: number, c: string, d: boolean) => 1)
  usePromise(async (a: number, b: number, c: string, d: boolean, e: []) => 1)
  usePromise(
    async (a: number, b: number, c: string, d: boolean, e: [], f: boolean) => 1,
  )
})

it('test useDebounce call signature', () => {
  useDebounce(() => {})
  useDebounce(() => {}, 12)
  useDebounce(() => {}, 12, [1])
  useDebounce(() => {}, 12, [1, 2])
  useDebounce(() => {}, 12, [1, 2, 3])
  useDebounce(() => {}, 12, [1, 2, 3, 4])
  useDebounce(() => {}, 12, [1, 2, 3, 4, 5])
  useDebounce(() => {}, 12, [1, 2, 3, 4, 5, 6])
})

it('test useThrottle call signature', () => {
  useThrottle(() => {})
  useThrottle(() => {}, 12)
  useThrottle(() => {}, 12, [1])
  useThrottle(() => {}, 12, [1, 2])
  useThrottle(() => {}, 12, [1, 2, 3])
  useThrottle(() => {}, 12, [1, 2, 3, 4])
  useThrottle(() => {}, 12, [1, 2, 3, 4, 5])
  useThrottle(() => {}, 12, [1, 2, 3, 4, 5, 6])
})
