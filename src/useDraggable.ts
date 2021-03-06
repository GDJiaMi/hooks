import { RefObject, useEffect, useState, useCallback } from 'react'
import useGesture, { GestureCoordinate } from './useGesture'
import useRefProps from './useRefProps'
import useRefState from './useRefState'

export interface Coordinate {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds extends Coordinate, Size {}

export interface useDraggableOptions<T extends HTMLElement> {
  /**
   * 设置可以拖拽的方向. default is 'both'
   */
  axis?: 'x' | 'y' | 'both'
  /**
   * 默认的偏移
   */
  defaultTranslate?: { x: number; y: number }
  /**
   * 设置拖拽的范围. bounds是基于screen的
   * 可以是selector 或者是'parent'
   */
  bounds?: Bounds | string
  /**
   * 停靠边缘
   */
  edge?: boolean
  edgePadding?: number
  onDown?: (pos: GestureCoordinate) => false | void
  onMove?: (pos: GestureCoordinate, offset: Coordinate) => void
  onUp?: (pos: GestureCoordinate, offset: Coordinate) => void
  disableTransform?: boolean
  ref?: RefObject<T>
}

/**
 * 获取
 * @param el
 */
function getElementBounds(el: HTMLElement): Bounds {
  const bounds = el.getBoundingClientRect()

  return {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
  }
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
  bounds?: Bounds | string,
): Coordinate {
  if (bounds == null) {
    return offset
  }
  const elRect = getElementBounds(el)
  let boundRect: Bounds

  if (typeof bounds === 'string') {
    let boundEl =
      bounds === 'parent' ? el.parentElement : document.querySelector(bounds)
    if (boundEl == null || !(boundEl instanceof HTMLElement)) {
      throw Error('Bounds selector "' + bounds + '" could not find an element.')
    }
    boundRect = getElementBounds(boundEl)
  } else {
    boundRect = bounds
  }

  const coordAfterDrag = { x: elRect.x + offset.x, y: elRect.y + offset.y }
  const right = coordAfterDrag.x + elRect.width
  const bottom = coordAfterDrag.y + elRect.height
  const boundsRight = boundRect.x + boundRect.width
  const boundsBottom = boundRect.y + boundRect.height
  let x: number = coordAfterDrag.x
  let y: number = coordAfterDrag.y

  if (right > boundsRight) {
    x -= right - boundsRight
  }

  if (bottom > boundsBottom) {
    y -= bottom - boundsBottom
  }

  x = Math.max(x, boundRect.x)
  y = Math.max(y, boundRect.y)

  return {
    x: x - elRect.x,
    y: y - elRect.y,
  }
}

/**
 * 停靠边缘
 */
function berthEdge(
  offset: Coordinate,
  el: HTMLElement,
  bounds: Bounds | string = 'body',
  padding: number = 0,
): Coordinate {
  const elRect = getElementBounds(el)
  let boundRect: Bounds

  if (typeof bounds === 'string') {
    let boundEl =
      bounds === 'parent' ? el.parentElement : document.querySelector(bounds)
    if (boundEl == null || !(boundEl instanceof HTMLElement)) {
      throw Error('Bounds selector "' + bounds + '" could not find an element.')
    }
    boundRect = getElementBounds(boundEl)
  } else {
    boundRect = bounds
  }

  let x: number =
    elRect.x - boundRect.x > boundRect.width / 2
      ? boundRect.width - (elRect.width + padding) // right berth
      : padding
  return {
    x,
    y: offset.y,
  }
}

const DEFAULT_TRANSLATE = { x: 0, y: 0 }

/**
 * 给指定element注入可拖拽行为
 */
export default function useDraggable<T extends HTMLElement = HTMLDivElement>(
  options: useDraggableOptions<T> = {},
) {
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset, offsetRef] = useRefState(
    options.defaultTranslate || DEFAULT_TRANSLATE,
  )
  const optionsRef = useRefProps(options)
  const { x, y } = offset

  const { ref: el } = useGesture({
    onDown: info => {
      if (
        optionsRef.current.onDown &&
        optionsRef.current.onDown(info) === false
      ) {
        return false
      }

      setDragging(true)
      return
    },
    onMove: info => {
      const axis = optionsRef.current.axis
      const { x: deltaX, y: deltaY } = restrictInBounds(
        { x: info.deltaX, y: info.deltaY },
        info.target,
        optionsRef.current.bounds ||
          (optionsRef.current.edge ? 'body' : undefined),
      )
      const offset = offsetRef.current
      const newOffset = {
        x: axis === 'y' ? offset.x : deltaX + offset.x,
        y: axis === 'x' ? offset.y : deltaY + offset.y,
      }

      if (optionsRef.current.onMove) {
        optionsRef.current.onMove(info, offset)
      }

      setOffset(newOffset)
      return
    },
    onUp: info => {
      setDragging(false)
      let offset = offsetRef.current
      if (optionsRef.current.edge) {
        offset = berthEdge(
          offset,
          info.target,
          optionsRef.current.bounds,
          optionsRef.current.edgePadding,
        )
        requestAnimationFrame(() => {
          setOffset(offset)
        })
      }
      if (optionsRef.current.onUp) {
        optionsRef.current.onUp(info, offset)
      }
    },
    ref: options.ref,
  })

  const resetOffset = useCallback(() => {
    const { x, y } = restrictInBounds(
      optionsRef.current.defaultTranslate || DEFAULT_TRANSLATE,
      el.current!,
      optionsRef.current.bounds ||
        (optionsRef.current.edge ? 'body' : undefined),
    )

    let offset = offsetRef.current
    offset = {
      x: x + offset.x,
      y: y + offset.y,
    }

    if (optionsRef.current.edge) {
      offset = berthEdge(
        offset,
        el.current!,
        optionsRef.current.bounds,
        optionsRef.current.edgePadding,
      )
    }
    setOffset(offset)
  }, [])

  useEffect(() => {
    resetOffset()
  }, [])

  useEffect(
    () => {
      if (!optionsRef.current.disableTransform) {
        el.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    },
    [x, y],
  )

  return { ref: el, dragging, translate: offset, resetOffset }
}
