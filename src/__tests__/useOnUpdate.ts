import { renderHook, cleanup } from 'react-hooks-testing-library'
import { useOnUpdate } from '../index'

beforeEach(cleanup)

it('test useOnUpdate', () => {
  const fn = jest.fn()
  const { rerender } = renderHook(
    (props: { a: number; b: string }) => useOnUpdate(fn, props.a, props.b),
    {
      initialProps: {
        a: 1,
        b: '12',
      },
    },
  )

  expect(fn).toBeCalled()
  rerender({ a: 1, b: '12' })
  expect(fn).toBeCalledTimes(1)
  rerender({ a: 2, b: '12' })
  expect(fn).toBeCalledTimes(2)
  rerender({ a: 2, b: '123' })
  expect(fn).toBeCalledTimes(3)
})
