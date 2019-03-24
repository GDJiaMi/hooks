import { renderHook, cleanup } from 'react-hooks-testing-library'
import { useRefUnmounted } from '../index'

beforeEach(cleanup)

it('test useRefUnmounted', () => {
  const { result, unmount } = renderHook(() => useRefUnmounted())

  expect(result.current.current).toBeFalsy()

  unmount()

  expect(result.current.current).toBeTruthy()
})
