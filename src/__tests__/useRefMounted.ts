import { renderHook, cleanup } from 'react-hooks-testing-library'
import { useRefMounted } from '../index'

beforeEach(cleanup)

it('test useRefUnmounted', () => {
  const { result } = renderHook(() => useRefMounted())

  expect(result.current.current).toBeTruthy()
})
