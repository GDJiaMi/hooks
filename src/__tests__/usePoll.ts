import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import { usePoll } from '../index'
import { microDelay } from './helper'

describe('test usePoll', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  beforeEach(cleanup)

  const DURATION = 3000

  it('test base processes', async () => {
    const POLL_RETURN = 1
    const poller = jest.fn(() => Promise.resolve(POLL_RETURN))
    const condition = jest.fn(() => Promise.resolve(true))
    const { result, unmount } = renderHook(() =>
      usePoll({ poller, condition, duration: DURATION }),
    )
    await microDelay()
    expect(condition).toBeCalled()
    expect(result.current.polling).toBeTruthy()
    expect(poller).not.toBeCalled()
    act(() => {
      jest.advanceTimersByTime(DURATION)
    })

    // start call poller
    expect(poller).toBeCalled()

    // check condition
    await microDelay()
    expect(condition).toHaveBeenLastCalledWith(POLL_RETURN, undefined)
    await microDelay()
    expect(result.current.polling).toBeFalsy()

    // continue poll
    act(() => {
      jest.advanceTimersByTime(1)
    })
    poller.mockClear()
    expect(result.current.polling).toBeTruthy()

    // unmount
    unmount()
    jest.advanceTimersByTime(DURATION)
    expect(poller).not.toBeCalled()
  })

  // TODO: 详细测试
})
