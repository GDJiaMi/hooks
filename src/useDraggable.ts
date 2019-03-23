import { RefObject, useEffect, useRef } from "react";
import useSideEffectState from "./useSideEffectState";
import { extraPosition, isMouseEvent, TOUCH_SUPPROTED } from "./utils";

/**
 * 给指定element注入可拖拽行为
 * TODO: 抽取为draggle core. 扩展其他hook. 如限定拖拽方式, 拖拽区域, 自动吸附
 * @param ref 指定element ref. ref应该是静态元素, 即始终指向同一个元素
 */
export default function useDraggable<T extends HTMLElement>(
  ref?: RefObject<T>
) {
  const el = ref || (useRef<T>() as RefObject<T>);
  const [{ dx, dy }, setOffset, getOffset] = useSideEffectState({
    dx: 0,
    dy: 0
  });
  const [dragging, setDragging] = useSideEffectState(false);

  useEffect(() => {
    const handleActionStart = (event: MouseEvent | TouchEvent) => {
      const pos = extraPosition(event);
      if (pos == null) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      const { x, y, id } = pos;
      const { dx, dy } = getOffset();
      const startX = x;
      const startY = y;
      setDragging(true);

      const handleActionMove = (event: MouseEvent | TouchEvent) => {
        if (!isMouseEvent(event)) {
          event.preventDefault();
        }

        const pos = extraPosition(event, id);
        if (pos == null) {
          return;
        }

        const { x, y } = pos;
        const newDx = x - startX + dx;
        const newDy = y - startY + dy;
        console.log("move", newDx, newDy, x, y);
        setOffset({ dx: newDx, dy: newDy });
      };

      const handleActionEnd = () => {
        setDragging(false);
      };

      if (isMouseEvent(event)) {
        document.addEventListener("mousemove", handleActionMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", handleActionMove);
            handleActionEnd();
          },
          { once: true }
        );
      } else {
        const clearup = () => {
          console.log("clean");
          el.current!.addEventListener("touchmove", handleActionMove);
          handleActionEnd();
        };

        el.current!.addEventListener("touchmove", handleActionMove);
        el.current!.addEventListener("touchend", clearup, { once: true });
        el.current!.addEventListener("touchcancel", clearup, { once: true });
      }
    };

    el.current!.addEventListener("mousedown", handleActionStart);
    TOUCH_SUPPROTED &&
      el.current!.addEventListener("touchstart", handleActionStart);

    return () => {
      el.current!.removeEventListener("mousedown", handleActionStart);
      TOUCH_SUPPROTED &&
        el.current!.removeEventListener("touchstart", handleActionStart);
    };
  }, []);

  useEffect(
    () => {
      el.current!.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    },
    [dx, dy]
  );

  return el;
}
