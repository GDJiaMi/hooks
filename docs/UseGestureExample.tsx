import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from '../src'
import { clamp } from '../src/utils'

export const Example = () => {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const el = useGesture({
    onAction: ({ down, coordinate: { velocity, distanceX, distanceY } }) => {
      velocity = clamp(velocity, 1, 8)
      set({
        xy: down ? [distanceX, distanceY] : [0, 0],
        config: { mass: velocity, tension: 500 * velocity, friction: 50 },
      })
    },
  })

  return (
    <animated.div
      ref={el}
      style={{
        border: '1px solid gray',
        width: 100,
        height: 100,
        transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
      }}
    />
  )
}

export default Example
