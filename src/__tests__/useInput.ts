import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import { useInput } from '../index'

afterEach(cleanup)

it('should set Value after event triggered', () => {
  const { result } = renderHook(() => useInput('initial'))
  expect(result.current.value).toBe('initial')

  act(() => {
    result.current.onChange({
      target: { value: 'new value' },
    } as React.ChangeEvent<{ value: string }>)
  })

  expect(result.current.value).toBe('new value')

  act(() => {
    result.current.setValue('value by setValue')
  })

  expect(result.current.value).toBe('value by setValue')
})
