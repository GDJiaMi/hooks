import { RefObject, useRef, useEffect } from "react";
import {
  GestureCoordinate as Coord,
  TOUCH_SUPPROTED,
  extraPosition,
  isMouseEvent
} from "src/utils";
import useInstance from "src/useInstance";

export interface GestureCoordinate extends Coord {
  // 事件时间戳
  timestamp: number;
  target: HTMLElement;
}

export interface GestureMoveCoordinate extends GestureCoordinate {
  start: GestureCoordinate;
  previous: GestureCoordinate;
  // 相比较上次移动的位置偏移
  deltaX: number;
  deltaY: number;
  delta: number;
  // 相比较onDown的位置偏移
  distanceX: number;
  distanceY: number;
  distance: number;
  // 速度
  velocity: number;
}

export interface GestureOptions<T extends HTMLElement> {
  onDown?: (info: GestureCoordinate) => false | void;
  onMove?: (info: GestureMoveCoordinate) => false | void;
  onUp?: (info: GestureCoordinate) => void;
  ref?: RefObject<T>;
}

export type GestureEvent = MouseEvent | TouchEvent;

/**
 * 获取抽象化的mouse/touch事件
 * TODO: pasive
 * @param options
 */
export default function useGesture<T extends HTMLElement = HTMLDivElement>(
  options: GestureOptions<T>
) {
  const el = options.ref || (useRef<T>() as RefObject<T>);
  const [state, updateState] = useInstance<{
    start?: GestureCoordinate;
    interacting?: boolean;
    last?: GestureCoordinate;
  }>({});

  useEffect(() => {
    const handleActionStart = (event: GestureEvent) => {
      const pos = extraPosition(event);
      if (pos == null) {
        return;
      }

      const coord = { ...pos, timestamp: Date.now(), target: el.current! };

      if (options.onDown != null && options.onDown(coord) === false) {
        // prevented
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      updateState({ start: coord, last: coord, interacting: true });

      const handleActionMove = (event: GestureEvent) => {
        if (!isMouseEvent(event)) {
          event.preventDefault();
        }

        const pos = extraPosition(event, state.start && state.start.id);
        if (pos == null) {
          return;
        }

        const start = state.start!;
        const last = state.last!;
        const deltaX = pos.pageX - last.pageX;
        const deltaY = pos.pageY - last.pageY;
        const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const distanceX = pos.pageX - start.pageX;
        const distanceY = pos.pageY - start.pageY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        const timestamp = Date.now();

        const coord: GestureMoveCoordinate = {
          ...pos,
          start: start,
          previous: last,
          timestamp,
          deltaX,
          deltaY,
          delta,
          distanceX,
          distanceY,
          distance,
          velocity: delta / (timestamp - last.timestamp),
          target: el.current!
        };

        if (options.onMove != null && options.onMove(coord) === false) {
          return;
        }

        updateState({ last: coord });
      };

      const handleActionEnd = (event: GestureEvent) => {
        if (!state.interacting) {
          return;
        }

        const pos = extraPosition(event)!;
        const coord = { ...pos, timestamp: Date.now(), target: el.current! };
        updateState({ interacting: false });
        if (options.onUp) {
          options.onUp(coord);
        }
      };

      if (isMouseEvent(event)) {
        const clean = (event: MouseEvent) => {
          document.removeEventListener("mousemove", handleActionMove);
          handleActionEnd(event);
        };
        document.addEventListener("mousemove", handleActionMove);
        document.addEventListener("mouseup", clean, { once: true });
        document.addEventListener("mouseleave", clean, { once: true });
      } else {
        const clean = (event: TouchEvent) => {
          el.current!.removeEventListener("touchmove", handleActionMove);
          handleActionEnd(event);
        };
        el.current!.addEventListener("touchmove", handleActionMove);
        el.current!.addEventListener("touchend", clean, { once: true });
        el.current!.addEventListener("touchcancel", clean, { once: true });
      }
    };

    const useTouch = TOUCH_SUPPROTED;
    el.current!.addEventListener("mousedown", handleActionStart);
    useTouch && el.current!.addEventListener("touchstart", handleActionStart);
    return () => {
      el.current!.removeEventListener("mousedown", handleActionStart);
      useTouch &&
        el.current!.removeEventListener("touchstart", handleActionStart);
    };
  }, []);

  return el;
}
