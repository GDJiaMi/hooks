import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import { useAsyncOnMount } from '../index'
import { delay } from './helper'

const MOCK_ERROR = new Error('mockError')
const MOCK_RETURN = 'HELLO'

beforeEach(cleanup)

describe('test useASyncOnMount', () => {
  it('should call fn', async () => {
    const fn = jest.fn(() => Promise.resolve())
    const {
      result: { current },
      rerender,
    } = renderHook(() => useAsyncOnMount(fn))
    expect(fn).toBeCalled()

    rerender()
    expect(fn).toBeCalledTimes(1)

    // retry
    act(() => {
      current.retry()
    })

    rerender()
    expect(fn).toBeCalledTimes(2)
  })

  it('should set loading', async () => {
    const fn = jest.fn(() => Promise.reject(MOCK_ERROR))
    const { result, waitForNextUpdate } = renderHook(() => useAsyncOnMount(fn))

    expect(result.current.loading).toBeTruthy()

    await waitForNextUpdate()

    expect(result.current.loading).toBeFalsy()
  })

  it('should set error when fn throw', async () => {
    act(async () => {
      const fn = jest.fn(() => Promise.reject(MOCK_ERROR))
      const { result, rerender } = renderHook(() => useAsyncOnMount(fn))

      await delay()
      expect(result.current.error).toBe(MOCK_ERROR)

      act(() => {
        result.current.retry()
      })

      rerender()
      expect(result.current.error).toBeUndefined()
    })
  })

  it('should return specified value', async () => {
    const fn = jest.fn(() => Promise.resolve(MOCK_RETURN))
    const { result } = renderHook(() => useAsyncOnMount(fn))
    await delay()
    expect(result.current.value).toBe(MOCK_RETURN)
  })
})
