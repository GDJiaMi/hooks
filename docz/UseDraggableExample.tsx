import React from 'react'
import { useDraggable } from '../src'

export const Example = () => {
  const { ref, dragging } = useDraggable<HTMLDivElement>({
    bounds: 'parent',
    edge: true,
    defaultTranslate: { x: 10, y: 10 },
    onDown: info => {
      console.log('down', info)
    },
    onMove: info => {
      console.log('move', info)
    },
    onUp: info => {
      console.log('up', info)
    },
  })

  return (
    <div style={{ border: '1px solid red', width: 500, height: 500 }}>
      <div
        ref={ref}
        style={{
          border: '1px solid gray',
          width: 100,
          height: 100,
          background: dragging ? 'cyan' : 'gray',
          transition: dragging ? undefined : 'transform 0.3s ease',
        }}
      />
    </div>
  )
}

export default Example
