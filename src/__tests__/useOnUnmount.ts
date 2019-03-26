import { renderHook, cleanup } from 'react-hooks-testing-library'
import { useOnUnmount } from '../index'

beforeEach(cleanup)

it('test useOnUnmount', () => {
  const fn = jest.fn()
  const fn2 = jest.fn()

  const { rerender, unmount } = renderHook(
    (props: { fn: Function }) => useOnUnmount(props.fn),
    {
      initialProps: { fn },
    },
  )

  expect(fn).not.toBeCalled()

  rerender({ fn: fn2 })
  expect(fn).not.toBeCalled()
  expect(fn2).not.toBeCalled()

  unmount()
  expect(fn2).toBeCalled()
  expect(fn).not.toBeCalled()
})
