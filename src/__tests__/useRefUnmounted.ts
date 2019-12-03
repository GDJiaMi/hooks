import { renderHook, cleanup } from '@testing-library/react-hooks'
import { useRefUnmounted } from '../index'

beforeEach(cleanup)

it('test useRefUnmounted', () => {
  const { result, unmount } = renderHook(() => useRefUnmounted())

  expect(result.current.current).toBeFalsy()

  unmount()

  expect(result.current.current).toBeTruthy()
})
