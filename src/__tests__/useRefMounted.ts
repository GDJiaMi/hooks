import { renderHook, cleanup } from '@testing-library/react-hooks'
import { useRefMounted } from '../index'

beforeEach(cleanup)

it('test useRefUnmounted', () => {
  const { result } = renderHook(() => useRefMounted())

  expect(result.current.current).toBeTruthy()
})
