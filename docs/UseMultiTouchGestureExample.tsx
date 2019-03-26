import React, { useState } from 'react'
import { useMultiTouchGesture } from '../src'
import { GestureCoordinate } from '../src/useGesture'

export const Example = () => {
  const [touches, setTouches] = useState<GestureCoordinate[]>([])
  const { ref, interacting } = useMultiTouchGesture({
    onDown: info => {
      setTouches(info.touches)
    },
    onMove: info => {
      setTouches(info.touches)
    },
    onUp: info => {
      setTouches(info.touches)
    },
  })

  return (
    <div
      ref={ref}
      style={{
        border: '1px solid gray',
        width: 500,
        height: 500,
        background: interacting ? 'gray' : undefined,
      }}
    >
      {touches.map(touch => {
        return (
          <div
            key={touch.id}
            style={{
              position: 'fixed',
              width: 10,
              height: 10,
              background: 'red',
              top: 0,
              left: 0,
              transform: `translate3d(${touch.pageX}px,${touch.pageY}px,0)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default Example
