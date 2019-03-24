import { isMouseEvent, extraPosition, pickProperties } from '../utils'

it('test isMouseEvent', () => {
  expect(isMouseEvent(new MouseEvent('mousedown'))).toBeTruthy()
  expect(isMouseEvent(new MouseEvent('no-mouse'))).toBeFalsy()
  expect(isMouseEvent(new TouchEvent('touchstart'))).toBeFalsy()
})

it('test pickProperties', () => {
  const obj = {
    a: 1,
    b: '12',
    c: true,
  }
  expect(pickProperties(obj, ['a', 'c'])).toEqual({ a: 1, c: true })
})

function createPosition() {
  const num = () => Math.round(Math.random() * 100)
  const pos = {
    clientX: num(),
    clientY: num(),
    pageX: num(),
    pageY: num(),
    screenX: num(),
    screenY: num(),
  }
  return pos
}

function createEvent(type: string) {
  const pos = createPosition()
  return [
    {
      type,
      ...pos,
    },
    pos,
  ]
}

it('test extraPosition', () => {
  let [mouseevent, pos] = createEvent('mousedown')
  expect(extraPosition(mouseevent as MouseEvent)).toEqual(pos)

  pos = createPosition()
  const touchEvent = new TouchEvent('touchstart', {
    targetTouches: [
      {
        identifier: 0,
        ...pos,
      } as Touch,
    ],
  })

  expect(extraPosition(touchEvent)).toEqual({ ...pos, id: 0 })

  const pos2 = createPosition()
  const pos3 = createPosition()
  const touchMoveEvent = new TouchEvent('touchstart', {
    touches: [
      {
        identifier: 0,
        ...pos2,
      } as Touch,
      {
        identifier: 2,
        ...pos3,
      } as Touch,
    ],
  })

  expect(extraPosition(touchMoveEvent, 1)).toBeFalsy()
  expect(extraPosition(touchMoveEvent, 2)).toEqual({ ...pos3, id: 2 })
})
