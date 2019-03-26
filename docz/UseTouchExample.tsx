import React, { useState } from 'react'
import { useTouch } from '../src'

export function TapExample() {
  const [scale, setScale] = useState(1)
  const [initialScale, setInitialScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const { ref } = useTouch({
    onTap: info => {
      console.log('tap', info)
    },
    onDoubleTap: info => {
      console.log('double tap', info)
    },
    onSingleTap: info => {
      console.log('single tap', info)
    },
    onLongTap: info => {
      console.log('log tap', info)
    },
    onSwipe: info => {
      console.log('swipe', info)
    },
    onDown: info => {
      setInitialScale(scale)
    },
    onPinch: info => {
      console.log('pinch', info)
      setScale(initialScale * info.scale)
    },
    onRotate: info => {
      console.log('rotate', info)
      setRotate(rotate => rotate + info.angle)
    },
  })

  return (
    <div
      ref={ref}
      style={{
        width: 100,
        height: 100,
        background: 'red',
        transform: `scale(${scale}) rotateZ(${rotate}deg)`,
      }}
    />
  )
}

export function PressMoveExample() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { ref } = useTouch({
    onPressMove: info => {
      console.log('move', info)
      setOffset(off => ({ x: info.deltaX + off.x, y: info.deltaY + off.y }))
    },
  })

  return (
    <div
      ref={ref}
      style={{
        width: 100,
        height: 100,
        background: 'red',
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    />
  )
}
