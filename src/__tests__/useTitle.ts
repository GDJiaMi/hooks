import { renderHook, cleanup } from '@testing-library/react-hooks'
import { useTitle } from '../index'

beforeEach(cleanup)

it('test useTitle', () => {
  const { rerender } = renderHook(
    ({ title }: { title: string }) => useTitle(title),
    { initialProps: { title: 'hello' } },
  )

  expect(document.title).toBe('hello')

  rerender({ title: 'world' })

  expect(document.title).toBe('world')
})
