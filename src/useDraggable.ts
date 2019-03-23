import { RefObject, useEffect, useState } from "react";
import useGesture from "./useGesture";

/**
 * 给指定element注入可拖拽行为
 * TODO: 抽取为draggle core. 扩展其他hook. 如限定拖拽方式, 拖拽区域, 自动吸附
 * @param ref 指定element ref. ref应该是静态元素, 即始终指向同一个元素
 */
export default function useDraggable<T extends HTMLElement = HTMLDivElement>(
  ref?: RefObject<T>
) {
  const [offset, setOffset] = useState({
    x: 0,
    y: 0
  });
  const { x, y } = offset;
  const [dragging, setDragging] = useState(false);
  const el = useGesture({
    onDown: () => {
      setDragging(true);
    },
    onMove: info => {
      setOffset(offset => ({
        x: info.deltaX + offset.x,
        y: info.deltaY + offset.y
      }));
    },
    onUp: () => {
      setDragging(false);
    },
    ref
  });

  useEffect(
    () => {
      el.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [x, y]
  );

  return { ref: el, dragging, translate: offset };
}
