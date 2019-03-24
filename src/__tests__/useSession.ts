import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import { useSession } from '../index'

afterEach(cleanup)

const KEY = '__KEY__'
const SAVED_VALUE = 'HELLO'

function testSessionSave(keepOnWindowClose: boolean) {
  const { result } = renderHook(() =>
    useSession<string>(KEY, keepOnWindowClose),
  )
  const storage = keepOnWindowClose
    ? window.localStorage
    : window.sessionStorage

  expect(result.current[0]).toBeFalsy()

  act(() => {
    result.current[1](SAVED_VALUE)
  })

  expect(result.current[0]).toBe(SAVED_VALUE)
  expect(JSON.parse(storage.getItem(KEY)!)).toBe(SAVED_VALUE)

  act(() => {
    result.current[2]()
  })

  expect(result.current[0]).toBeFalsy()
  expect(storage.getItem(KEY)).toBeFalsy()
}

function testSessionRestore(keepOnWindowClose: boolean) {
  const storage = keepOnWindowClose
    ? window.localStorage
    : window.sessionStorage
  storage.setItem(KEY, JSON.stringify(SAVED_VALUE))

  const {
    result: { current },
  } = renderHook(() => useSession(KEY, keepOnWindowClose))
  expect(current[0]).toBe(SAVED_VALUE)
}

function testRestoreDefaultValue(keepOnWindowClose: boolean) {
  const storage = keepOnWindowClose
    ? window.localStorage
    : window.sessionStorage
  const {
    result: { current },
  } = renderHook(() => useSession(KEY, keepOnWindowClose, SAVED_VALUE))

  expect(current[0]).toBe(SAVED_VALUE)
  expect(JSON.parse(storage.getItem(KEY)!)).toBe(SAVED_VALUE)
}

describe('should save to storage', () => {
  afterEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('should save to localStorage', () => {
    testSessionSave(true)
  })

  it('should save to sessionStorage', () => {
    testSessionSave(false)
  })

  it('should restore state from localStorage', () => {
    testSessionRestore(true)
  })

  it('should restore state from sessionStorage', () => {
    testSessionRestore(false)
  })

  it('should use default value when localStorage.getItem return null', () => {
    testRestoreDefaultValue(true)
  })

  it('should use default value when sessionStorage.getItem return null', () => {
    testRestoreDefaultValue(false)
  })
})
