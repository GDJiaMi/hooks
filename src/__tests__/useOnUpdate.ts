import { renderHook, cleanup } from 'react-hooks-testing-library'
import { useOnUpdate } from '../index'

beforeEach(cleanup)

describe('test useOnUpdate', () => {
  it('skip onMount', () => {
    const fn = jest.fn()
    const { rerender } = renderHook(
      (props: { a: number; b: string }) => useOnUpdate(fn, [props.a, props.b]),
      {
        initialProps: {
          a: 1,
          b: '12',
        },
      },
    )

    expect(fn).not.toBeCalled()
    rerender({ a: 1, b: '12' })
    expect(fn).not.toBeCalled()
    rerender({ a: 2, b: '12' })
    expect(fn).toHaveBeenLastCalledWith(2, '12')
    rerender({ a: 2, b: '123' })
    expect(fn).toHaveBeenLastCalledWith(2, '123')
  })

  it('not skip onMount', () => {
    const fn = jest.fn()
    const { rerender } = renderHook(
      (props: { a: number; b: string }) =>
        useOnUpdate(fn, [props.a, props.b], false),
      {
        initialProps: {
          a: 1,
          b: '12',
        },
      },
    )

    expect(fn).toHaveBeenLastCalledWith(1, '12')
    rerender({ a: 1, b: '12' })
    expect(fn).toBeCalledTimes(1)
    rerender({ a: 2, b: '12' })
    expect(fn).toHaveBeenLastCalledWith(2, '12')
    rerender({ a: 2, b: '123' })
    expect(fn).toHaveBeenLastCalledWith(2, '123')
  })
})
