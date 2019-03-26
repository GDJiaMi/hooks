import { RefObject, useRef, useEffect } from 'react'
import {
  GestureCoordinate as Coord,
  TOUCH_SUPPROTED,
  extraPosition,
  isMouseEvent,
} from './utils'
import useInstance from './useInstance'
import useRefState from './useRefState'

export interface GestureCoordinate extends Coord {
  // 事件时间戳
  timestamp: number
  target: HTMLElement
  start?: GestureCoordinate
  previous?: GestureCoordinate
  // 相比较上次移动的位置偏移
  deltaX: number
  deltaY: number
  delta: number
  // 相比较onDown的位置偏移
  distanceX: number
  distanceY: number
  distance: number
  // 速度
  velocity: number
}

export interface GestureAction {
  down: boolean
  first: boolean
  coordinate: GestureCoordinate
}

export interface GestureOptions<T extends HTMLElement> {
  onDown?: (info: GestureCoordinate) => false | void
  onMove?: (info: GestureCoordinate) => void
  onUp?: (info: GestureCoordinate) => void
  onAction?: (info: GestureAction) => void
  ref?: RefObject<T>
}

export type GestureEvent = MouseEvent | TouchEvent

/**
 * 获取抽象化的mouse/touch事件
 * TODO: pasive
 * @param options
 */
export default function useGesture<T extends HTMLElement = HTMLDivElement>(
  options: GestureOptions<T>,
) {
  const el = options.ref || (useRef<T>() as RefObject<T>)
  const [interacting, setInteracting, refInteracting] = useRefState(false)
  const [state, updateState] = useInstance<{
    start?: GestureCoordinate
    last?: GestureCoordinate
  }>({})

  useEffect(() => {
    const handleActionStart = (event: GestureEvent) => {
      const pos = extraPosition(event)
      if (pos == null) {
        return
      }

      const coord: GestureCoordinate = {
        ...pos,
        timestamp: Date.now(),
        target: el.current!,
        delta: 0,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        distanceX: 0,
        distanceY: 0,
        velocity: 0,
      }

      if (options.onDown != null && options.onDown(coord) === false) {
        // prevented
        return
      }

      event.stopPropagation()
      event.preventDefault()

      if (options.onAction) {
        options.onAction({ down: true, first: true, coordinate: coord })
      }

      updateState({ start: coord, last: coord })
      setInteracting(true)

      /**
       * 处理移动
       */
      const handleActionMove = (event: GestureEvent) => {
        if (!isMouseEvent(event)) {
          event.preventDefault()
        }

        const pos = extraPosition(event, state.start && state.start.id)
        if (pos == null) {
          return
        }

        const start = state.start!
        const last = state.last!
        const deltaX = pos.pageX - last.pageX
        const deltaY = pos.pageY - last.pageY
        const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        const distanceX = pos.pageX - start.pageX
        const distanceY = pos.pageY - start.pageY
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
        const timestamp = Date.now()

        const coord: GestureCoordinate = {
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
          target: el.current!,
        }

        if (options.onMove) {
          options.onMove(coord)
        }

        if (options.onAction) {
          options.onAction({ down: true, first: false, coordinate: coord })
        }

        updateState({ last: coord })
      }

      /**
       * 动作结束
       */
      const handleActionEnd = (event: GestureEvent) => {
        if (!refInteracting.current) {
          return
        }

        const pos = extraPosition(event, state.start && state.start.id)!
        const coord = {
          ...state.last!,
          ...pos,
          timestamp: Date.now(),
          target: el.current!,
          start: state.start,
          last: state.last,
        }
        setInteracting(false)
        if (options.onUp) {
          options.onUp(coord)
        }
        if (options.onAction) {
          options.onAction({ down: false, first: false, coordinate: coord })
        }
      }

      if (isMouseEvent(event)) {
        const clean = (event: MouseEvent) => {
          document.removeEventListener('mousemove', handleActionMove)
          handleActionEnd(event)
        }
        document.addEventListener('mousemove', handleActionMove)
        document.addEventListener('mouseup', clean, { once: true })
        document.addEventListener('mouseleave', clean, { once: true })
      } else {
        const clean = (event: TouchEvent) => {
          el.current!.removeEventListener('touchmove', handleActionMove)
          handleActionEnd(event)
        }
        el.current!.addEventListener('touchmove', handleActionMove)
        el.current!.addEventListener('touchend', clean, { once: true })
        el.current!.addEventListener('touchcancel', clean, { once: true })
      }
    }

    const useTouch = TOUCH_SUPPROTED
    el.current!.addEventListener('mousedown', handleActionStart)
    useTouch && el.current!.addEventListener('touchstart', handleActionStart)
    return () => {
      el.current!.removeEventListener('mousedown', handleActionStart)
      useTouch &&
        el.current!.removeEventListener('touchstart', handleActionStart)
    }
  }, [])

  return { ref: el, interacting }
}
