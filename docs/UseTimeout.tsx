import React from 'react'
import { useTimeout } from '../src/index'

export default function Example() {
  const { ready, start, stop } = useTimeout({ duration: 5000 })
  return (
    <div>
      ready: {JSON.stringify(ready)}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  )
}
