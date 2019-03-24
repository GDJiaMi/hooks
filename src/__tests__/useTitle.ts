import { renderHook, cleanup } from 'react-hooks-testing-library'
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
