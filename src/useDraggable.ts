import { RefObject, useEffect, useState } from "react";
import useGesture from "./useGesture";
import useRefProps from "./useRefProps";

export interface Coordinate {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Coordinate, Size {}

export interface useDraggableOptions<T extends HTMLElement> {
  /**
   * 设置可以拖拽的方向. default is 'both'
   */
  axis?: "x" | "y" | "both";
  /**
   * 默认的偏移
   */
  defaultTranslate?: { x: number; y: number };
  /**
   * 设置拖拽的范围. bounds是基于screen的
   * 可以是selector 或者是'parent'
   */
  bounds?: Bounds | string;
  ref?: RefObject<T>;
}

/**
 * 限定在指定区域内
 *
 * @param offset
 * @param el
 * @param bounds
 */
function restrictInBounds(
  offset: Coordinate,
  el: HTMLElement,
  bounds?: Bounds | string
): Coordinate {
  if (bounds == null) {
    return offset;
  }
  const elRect = el.getBoundingClientRect() as Bounds;
  let boundRect: Bounds;

  if (typeof bounds === "string") {
    let boundEl =
      bounds === "parent" ? el.parentElement : document.querySelector(bounds);
    if (boundEl == null || !(boundEl instanceof HTMLElement)) {
      throw Error(
        'Bounds selector "' + bounds + '" could not find an element.'
      );
    }
    boundRect = boundEl.getBoundingClientRect() as Bounds;
  } else {
    boundRect = bounds;
  }

  const coordAfterDrag = { x: elRect.x + offset.x, y: elRect.y + offset.y };
  const right = coordAfterDrag.x + elRect.width;
  const bottom = coordAfterDrag.y + elRect.height;
  const boundsRight = boundRect.x + boundRect.width;
  const boundsBottom = boundRect.y + boundRect.height;
  let x: number = coordAfterDrag.x;
  let y: number = coordAfterDrag.y;

  if (right > boundsRight) {
    x -= right - boundsRight;
  }

  if (bottom > boundsBottom) {
    y -= bottom - boundsBottom;
  }

  x = Math.max(x, boundRect.x);
  y = Math.max(y, boundRect.y);

  return {
    x: x - elRect.x,
    y: y - elRect.y
  };
}

const DEFAULT_TRANSLATE = { x: 0, y: 0 };

/**
 * 给指定element注入可拖拽行为
 * TODO: 抽取为draggle core. 扩展其他hook. 如限定拖拽方式, 拖拽区域, 自动吸附
 * @param ref 指定element ref. ref应该是静态元素, 即始终指向同一个元素
 */
export default function useDraggable<T extends HTMLElement = HTMLDivElement>(
  options: useDraggableOptions<T> = {}
) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(
    options.defaultTranslate || DEFAULT_TRANSLATE
  );
  const { x, y } = offset;
  const optionsRef = useRefProps(options);

  const el = useGesture({
    onDown: () => {
      setDragging(true);
    },
    onMove: info => {
      const axis = optionsRef.current.axis;
      const { x: deltaX, y: deltaY } = restrictInBounds(
        { x: info.deltaX, y: info.deltaY },
        info.target,
        optionsRef.current.bounds
      );

      setOffset(offset => ({
        x: axis === "y" ? offset.x : deltaX + offset.x,
        y: axis === "x" ? offset.y : deltaY + offset.y
      }));
    },
    onUp: () => {
      setDragging(false);
    },
    ref: options.ref
  });

  useEffect(
    () => {
      el.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [x, y]
  );

  return { ref: el, dragging, translate: offset };
}
