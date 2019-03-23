export const TOUCH_SUPPROTED = "TouchEvent" in window;

export function isMouseEvent(evt: MouseEvent | TouchEvent): evt is MouseEvent {
  if (evt.type.startsWith("mouse")) {
    return true;
  }

  return false;
}

/**
 * 获取MouseEvent或TouchEvent中的坐标
 * @param evt
 */
export function extraPosition(
  evt: MouseEvent | TouchEvent,
  id?: number
): { x: number; y: number; id?: number } | undefined {
  if (isMouseEvent(evt)) {
    return { x: evt.clientX, y: evt.clientY };
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

  return { x: touch.pageX, y: touch.pageY, id: touch.identifier };
}
