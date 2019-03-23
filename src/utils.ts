export interface GestureCoordinate {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  // touch identifier
  id?: number;
}

export const TOUCH_SUPPROTED = "TouchEvent" in window;
export const GestureCoordinateKeys = [
  "clientX",
  "clientY",
  "pageX",
  "pageY",
  "screenX",
  "screenY"
];

export function isMouseEvent(evt: MouseEvent | TouchEvent): evt is MouseEvent {
  if (evt.type.startsWith("mouse")) {
    return true;
  }

  return false;
}

export function extraProperties(obj: object, keys: string[]): object {
  const newobj = {};
  for (let key of keys) {
    newobj[key] = obj[key];
  }
  return newobj;
}

/**
 * 获取MouseEvent或TouchEvent中的坐标
 * @param evt
 */
export function extraPosition(
  evt: MouseEvent | TouchEvent,
  id?: number
): GestureCoordinate | undefined {
  if (isMouseEvent(evt)) {
    return extraProperties(evt, GestureCoordinateKeys) as GestureCoordinate;
  }

  let touch: Touch | undefined;
  if (id) {
    for (let i = 0; i < evt.touches.length; i++) {
      if (evt.touches[i].identifier === id) {
        touch = evt.touches[i];
        break;
      }
    }
    if (touch == null) {
      return;
    }
  } else {
    touch = evt.targetTouches[0];
  }

  return {
    ...(extraProperties(touch, GestureCoordinateKeys) as GestureCoordinate),
    id: touch.identifier
  };
}
