import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import { useLifeCycles } from '../index'

beforeEach(cleanup)

describe('test useLifeCycles', () => {
  it('test mount', () => {
    const mounted = jest.fn()
    const { rerender } = renderHook(() =>
      useLifeCycles({
        onMount: mounted,
      }),
    )

    expect(mounted).toBeCalled()
    rerender()
    expect(mounted).toBeCalledTimes(1)
  })

  it('test unmount', () => {
    const unmounted = jest.fn()
    const { rerender, unmount } = renderHook(() =>
      useLifeCycles({
        onUnmount: unmounted,
      }),
    )
    expect(unmounted).not.toBeCalled()
    rerender()
    expect(unmounted).not.toBeCalled()
    unmount()
    expect(unmounted).toBeCalled()
  })

  it('test update without args', () => {
    const updated = jest.fn()
    const { rerender } = renderHook(() =>
      useLifeCycles({
        onUpdate: updated,
      }),
    )
    expect(updated).toBeCalled()
    rerender()
    expect(updated).toBeCalledTimes(2)
    rerender()
    expect(updated).toBeCalledTimes(3)
  })

  it('test update without args', () => {
    const updated = jest.fn()
    const { rerender } = renderHook(
      props =>
        useLifeCycles({
          onUpdate: [updated, props.a, props.b],
        }),
      {
        initialProps: { a: 1, b: '2' },
      },
    )
    expect(updated).toBeCalled()
    rerender()
    expect(updated).toBeCalledTimes(1)
    rerender({ a: 2, b: '2' })
    expect(updated).toBeCalledTimes(2)
    rerender({ a: 2, b: '3' })
    expect(updated).toBeCalledTimes(3)
    rerender({ a: 2, b: '3' })
    expect(updated).toBeCalledTimes(3)
  })
})
