import { RefObject, useRef, useEffect } from 'react'
import { TOUCH_SUPPROTED, extraPositions, isMouseEvent } from './utils'
import useInstance from './useInstance'
import { GestureCoordinate, GestureEvent } from './useGesture'
import useRefState from './useRefState'

export interface MultiTouchGesture {
  // 当前有效的触摸点
  touches: GestureCoordinate[]
  // 新增/移动/移除的触摸点
  changedTouches: GestureCoordinate[]
}

export interface GestureOptions<T extends HTMLElement> {
  onDown?: (info: MultiTouchGesture) => false | void
  onMove?: (info: MultiTouchGesture) => false | void
  onUp?: (info: MultiTouchGesture) => void
  onAction?: (info: GestureCoordinate[]) => void
  ref?: RefObject<T>
}

/**
 * 获取抽象化的mouse/touch事件. 支持多点触摸
 * TODO: pasive
 * TODO: 过滤
 * @param options
 */
export default function useMultiTouchGesture<
  T extends HTMLElement = HTMLDivElement
>(options: GestureOptions<T>) {
  const el = options.ref || (useRef<T>() as RefObject<T>)
  const [interacting, setInteracting, refInteracting] = useRefState(false)
  const [state] = useInstance<{
    touches: Map<number, GestureCoordinate>
  }>({
    touches: new Map(),
  })

  useEffect(() => {
    const getTouches = () => {
      return Array.from(state.touches.values())
    }
    const handleActionStart = (event: GestureEvent) => {
      const coords = extraPositions(event)
      if (coords.length === 0) {
        return
      }

      const changedTouches: GestureCoordinate[] = coords.map(i => ({
        ...i,
        timestamp: Date.now(),
        target: el.current!,
        delta: 0,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        distanceX: 0,
        distanceY: 0,
        velocity: 0,
      }))

      if (
        options.onDown != null &&
        options.onDown({ touches: getTouches(), changedTouches }) === false
      ) {
        // prevented
        return
      }

      event.stopPropagation()
      event.preventDefault()

      // save
      changedTouches.forEach(i => {
        state.touches.set(i.id!, { ...i, start: i, previous: i })
      })

      if (options.onAction) {
        options.onAction(getTouches())
      }

      if (refInteracting.current) {
        return
      }

      setInteracting(true)

      /**
       * 处理移动
       */
      const handleActionMove = (event: GestureEvent) => {
        if (!isMouseEvent(event)) {
          event.preventDefault()
        }

        const coords = extraPositions(event)
        if (coords.length === 0) {
          return
        }

        const changedTouches = coords
          .map(pos => {
            const savedTouch = state.touches.get(pos.id!)
            if (savedTouch == null) {
              return null
            }

            const start = savedTouch.start!
            const last = savedTouch.previous!
            const deltaX = pos.pageX - last.pageX
            const deltaY = pos.pageY - last.pageY
            const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
            const distanceX = pos.pageX - start.pageX
            const distanceY = pos.pageY - start.pageY
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
            const timestamp = Date.now()
            const velocity = delta / (timestamp - last.timestamp)

            return {
              ...savedTouch,
              ...pos,
              previous: savedTouch,
              timestamp,
              deltaX,
              deltaY,
              delta,
              distanceX,
              distanceY,
              distance,
              velocity,
            } as GestureCoordinate
          })
          .filter((i): i is GestureCoordinate => !!i)

        if (
          options.onMove != null &&
          options.onMove({
            changedTouches: changedTouches,
            touches: getTouches(),
          }) === false
        ) {
          return
        }

        changedTouches.forEach(touch => {
          state.touches.set(touch.id!, touch)
        })

        if (options.onAction) {
          options.onAction(getTouches())
        }
      }

      if (isMouseEvent(event)) {
        // mouse drive
        const clean = (event: MouseEvent) => {
          // 鼠标事件只能有一个
          document.removeEventListener('mousemove', handleActionMove)

          if (!refInteracting.current) {
            return
          }

          const pos = extraPositions(event)
          const savedTouch = state.touches.get(pos[0].id!)!
          const changedTouches: GestureCoordinate[] = [
            {
              ...savedTouch,
              ...pos[0],
              previous: savedTouch,
              timestamp: Date.now(),
            },
          ]

          setInteracting(false)
          state.touches.clear()
          state.touches.delete(pos[0].id!)

          if (options.onUp) {
            options.onUp({
              touches: [],
              changedTouches,
            })
          }

          if (options.onAction) {
            options.onAction([])
          }
        }

        document.addEventListener('mousemove', handleActionMove)
        document.addEventListener('mouseup', clean, { once: true })
        document.addEventListener('mouseleave', clean, { once: true })
      } else {
        // touch drive
        const removeListener = () => {
          el.current!.removeEventListener('touchmove', handleActionMove)
          el.current!.removeEventListener('touchend', clean)
          el.current!.removeEventListener('touchcancel', clean)
          state.touches.clear()
        }

        const clean = (event: TouchEvent) => {
          if (!refInteracting.current) {
            removeListener()
            return
          }

          const coods = extraPositions(event)
          if (coods.length === 0) {
            return
          }

          const changedTouches = coods
            .map(pos => {
              const savedTouch = state.touches.get(pos.id!)
              if (savedTouch === null) {
                return null
              }

              return {
                ...savedTouch,
                ...pos,
                previous: savedTouch,
                timestamp: Date.now(),
              } as GestureCoordinate
            })
            .filter((i): i is GestureCoordinate => !!i)

          changedTouches.forEach(i => {
            state.touches.delete(i.id!)
          })

          const currentTouches = getTouches()
          if (options.onUp) {
            options.onUp({ touches: currentTouches, changedTouches })
          }

          if (currentTouches.length === 0) {
            removeListener()
            setInteracting(false)
          }
        }

        el.current!.addEventListener('touchmove', handleActionMove)
        el.current!.addEventListener('touchend', clean)
        el.current!.addEventListener('touchcancel', clean)
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
