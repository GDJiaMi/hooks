import { RefObject, useRef, useCallback } from 'react'
import useInstance from './useInstance'
import useMultiTouchGesture, {
  GestureCoordinate,
  MultiTouchGesture,
} from './useMultiTouchGesture'
import useRefProps from './useRefProps'
import useLifeCycles from './useLifeCycles'

export { GestureCoordinate }

export interface Coord {
  x: number
  y: number
}

export enum SwipeDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export interface UseTouchOption<T extends HTMLElement> {
  onDown?: (info: MultiTouchGesture) => void
  onMove?: (info: MultiTouchGesture) => void
  onUp?: (info: MultiTouchGesture) => void
  onTap?: (info: GestureCoordinate) => void
  onSingleTap?: (info: GestureCoordinate) => void
  onDoubleTap?: (info: GestureCoordinate) => void
  onLongTap?: (info: GestureCoordinate) => void
  onRotate?: (info: { angle: number }) => void
  onPinch?: (info: { center: Coord; scale: number }) => void
  onSwipe?: (info: { direction: SwipeDirection; distance: number }) => void
  onPressMove?: (info: GestureCoordinate) => void
  ref?: RefObject<T>
}

/**
 * 获取向量的距离
 */
function getLen(vector: Coord) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

function dot(v1: Coord, v2: Coord) {
  return v1.x * v2.x + v1.y * v2.y
}

function cross(v1: Coord, v2: Coord) {
  return v1.x * v2.y - v2.x * v1.y
}

function getAngle(v1: Coord, v2: Coord) {
  const mr = getLen(v1) * getLen(v2)
  if (mr === 0) return 0
  let r = dot(v1, v2) / mr
  if (r > 1) r = 1
  return Math.acos(r)
}

/**
 * 获取swipe的方向
 */
function getSwipeDirection(from: Coord, to: Coord) {
  return Math.abs(from.x - to.x) > Math.abs(from.y - to.y)
    ? from.x > to.x // 水平
      ? SwipeDirection.Left
      : SwipeDirection.Right
    : from.y > to.y
    ? SwipeDirection.Up
    : SwipeDirection.Down
}

/**
 * 获取旋转的角度
 */
function getRotateAngle(v1: Coord, v2: Coord) {
  let angle = getAngle(v1, v2)
  if (cross(v1, v2) > 0) {
    angle *= -1
  }

  return (angle * 180) / Math.PI
}

export default function useTouch<T extends HTMLElement = HTMLDivElement>(
  options: UseTouchOption<T>,
) {
  const [state] = useInstance<{
    start?: number // touchStart time
    last?: number // last touchStart time

    x1?: number
    y1?: number

    x2?: number
    y2?: number

    preTapPosition?: { x: number; y: number }
    preV?: { x: number; y: number }

    pinchStartLen?: number
    isSingleTap?: boolean
    isDoubleTap: boolean
    preventTap?: boolean
    multiTouch?: boolean

    longTapTimeout?: number
    singleTapTimeout?: number
    afterLongTapTimeout?: number
  }>(() => ({
    isSingleTap: false,
    isDoubleTap: false,
  }))
  const optionRef = useRefProps(options)
  const ref = options.ref || (useRef<T>() as RefObject<T>)

  const cancelLongTap = useCallback(() => {
    clearTimeout(state.longTapTimeout)
  }, [])

  const cancelAfterLongTapTimeout = useCallback(() => {
    clearTimeout(state.afterLongTapTimeout)
  }, [])

  const cancelSingleTap = useCallback(() => {
    clearTimeout(state.singleTapTimeout)
  }, [])

  useLifeCycles({
    onUnMount: () => {
      cancelLongTap()
      cancelAfterLongTapTimeout()
      cancelSingleTap()
    },
  })

  useMultiTouchGesture({
    ref,
    onDown: info => {
      if (optionRef.current.onDown) {
        optionRef.current.onDown(info)
      }

      const now = (state.start = Date.now())
      const len = info.touches.length
      const x1 = (state.x1 = info.touches[0].pageX)
      const y1 = (state.y1 = info.touches[0].pageY)
      const delta = now - (state.last || now)

      // 可能是双击: 时间间隔在250ms内, 且移动范围小于20
      if (state.preTapPosition) {
        state.isDoubleTap =
          delta > 0 &&
          delta <= 250 &&
          Math.abs(state.preTapPosition.x - x1) < 30 &&
          Math.abs(state.preTapPosition.y - y1) < 30

        if (state.isDoubleTap) {
          cancelSingleTap()
        }
      }

      state.preTapPosition = { x: x1, y: y1 }
      state.last = now

      if (len > 1) {
        // 多点触摸. 取消tap
        cancelLongTap()
        cancelSingleTap()
        // pinch 手势
        const v = {
          x: info.touches[1].pageX - x1,
          y: info.touches[1].pageY - y1,
        }
        state.preV = v
        state.pinchStartLen = getLen(v)
        state.multiTouch = true
      } else {
        state.isSingleTap = true
      }

      // 长按事件
      state.preventTap = false
      if (!state.multiTouch) {
        state.longTapTimeout = window.setTimeout(() => {
          if (optionRef.current.onLongTap) {
            optionRef.current.onLongTap(info.touches[0])
          }

          // 禁止长按之后tap事件
          state.preventTap = true
        }, 750)
      }
    },
    onMove: info => {
      if (optionRef.current.onMove) {
        optionRef.current.onMove(info)
      }

      const len = info.touches.length
      const currentX = info.touches[0].pageX
      const currentY = info.touches[0].pageY
      const preV = state.preV

      // 触摸点移动, 不再为tap
      state.isSingleTap = false
      state.isDoubleTap = false
      cancelLongTap()

      if (len > 1) {
        const secCurrentX = info.touches[1].pageX
        const secCurrentY = info.touches[1].pageY
        const v = {
          x: secCurrentX - currentX,
          y: secCurrentY - currentY,
        }
        if (preV != null) {
          if (
            state.pinchStartLen &&
            state.pinchStartLen > 0 &&
            optionRef.current.onPinch
          ) {
            // 触发的pinch事件
            const center = {
              x: (secCurrentX + currentX) / 2,
              y: (secCurrentY + currentY) / 2,
            }
            const scale = getLen(v) / state.pinchStartLen
            optionRef.current.onPinch({ center, scale })
          }

          if (optionRef.current.onRotate) {
            // 触发rotate 事件
            const angle = getRotateAngle(v, preV)
            optionRef.current.onRotate({ angle })
          }
        }

        state.preV = v
        state.multiTouch = true
      } else {
        // 移动事件
        if (optionRef.current.onPressMove) {
          optionRef.current.onPressMove(info.touches[0])
        }

        if (info.touches[0].distance > 15) {
          state.preventTap = true
        }
      }

      // 记录最后移动的位置
      state.x2 = currentX
      state.y2 = currentY
    },
    onUp: info => {
      if (optionRef.current.onUp) {
        optionRef.current.onUp(info)
      }

      cancelLongTap()

      if (!state.multiTouch) {
        // 单点触摸
        if (
          (state.x2 && Math.abs(state.x1! - state.x2) > 30) ||
          (state.y2 && Math.abs(state.y1! - state.y2) > 30)
        ) {
          /**
           * swipe: 移动距离超过30px
           */
          const direction = getSwipeDirection(
            { x: state.x1!, y: state.y1! },
            { x: state.x2!, y: state.y2! },
          )
          const distance =
            direction === SwipeDirection.Left ||
            direction === SwipeDirection.Right
              ? Math.abs(state.x1! - state.x2!)
              : Math.abs(state.y1! - state.y2!)

          if (optionRef.current.onSwipe) {
            optionRef.current.onSwipe({ direction, distance })
          }
        } else {
          // long tap已经触发或者出现移动
          if (state.preventTap) {
            state.preventTap = false
          } else {
            if (optionRef.current.onTap) {
              /**
               * tap
               */
              optionRef.current.onTap(info.changedTouches[0])
            }

            if (state.isDoubleTap) {
              /**
               * double tap
               */
              if (optionRef.current.onDoubleTap) {
                optionRef.current.onDoubleTap(info.changedTouches[0])
              }
              cancelSingleTap()
              state.isDoubleTap = false
            } else if (state.isSingleTap) {
              /**
               * single tap: 如果250ms内 没有再发起点击, 则为单击
               */
              state.singleTapTimeout = window.setTimeout(() => {
                if (optionRef.current.onSingleTap) {
                  optionRef.current.onSingleTap(info.changedTouches[0])
                }
              }, 250)
              state.isSingleTap = false
            }
          }
        }
      }

      state.preV = undefined
      state.pinchStartLen = undefined
      state.x1 = state.y1 = state.x2 = state.y2 = undefined
      state.multiTouch = info.touches.length !== 0
    },
  })

  return { ref }
}
