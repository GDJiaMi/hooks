export interface GestureCoordinate {
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  screenX: number
  screenY: number
  // touch identifier
  id?: number
}

export const TOUCH_SUPPROTED = 'TouchEvent' in window
export const GestureCoordinateKeys = [
  'clientX',
  'clientY',
  'pageX',
  'pageY',
  'screenX',
  'screenY',
]

export function isMouseEvent(evt: MouseEvent | TouchEvent): evt is MouseEvent {
  if (evt.type.startsWith('mouse')) {
    return true
  }

  return false
}

export function pickProperties(obj: object, keys: string[]): object {
  const newobj = {}
  for (let key of keys) {
    newobj[key] = obj[key]
  }
  return newobj
}

/**
 * 获取MouseEvent或TouchEvent中的坐标
 * @param evt
 */
export function extraPosition(
  evt: MouseEvent | TouchEvent,
  id?: number,
): GestureCoordinate | undefined {
  if (isMouseEvent(evt)) {
    return pickProperties(evt, GestureCoordinateKeys) as GestureCoordinate
  }

  let touch: Touch | undefined
  if (id) {
    for (let i = 0; i < evt.touches.length; i++) {
      if (evt.touches[i].identifier === id) {
        touch = evt.touches[i]
        break
      }
    }
    if (touch == null) {
      return
    }
  } else {
    touch = evt.targetTouches[0]
  }

  return {
    ...(pickProperties(touch, GestureCoordinateKeys) as GestureCoordinate),
    id: touch.identifier,
  }
}

/**
 * 获取多点触摸
 */
export function extraPositions(
  evt: MouseEvent | TouchEvent,
): GestureCoordinate[] {
  if (isMouseEvent(evt)) {
    return [
      {
        id: 0,
        ...(pickProperties(evt, GestureCoordinateKeys) as GestureCoordinate),
      },
    ]
  }

  return Array.prototype.map.call(evt.changedTouches, (touch: Touch) => {
    return {
      id: touch.identifier,
      ...pickProperties(touch, GestureCoordinateKeys),
    }
  })
}

export function clamp(num: number, lower: number, upper: number) {
  if (num === num) {
    if (upper !== undefined) {
      num = num <= upper ? num : upper
    }

    if (lower !== undefined) {
      num = num >= lower ? num : lower
    }
  }

  return num
}

let uid = 0
export function getUid() {
  return (uid = uid + (1 % (Number.MAX_SAFE_INTEGER - 1)))
}
