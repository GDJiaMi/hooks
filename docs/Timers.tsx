import React, { useState } from 'react'
import { useTimeout, useInterval } from '../src/index'

export function UseTimeoutExample() {
  const { ready, start, stop } = useTimeout({ duration: 5000 })
  return (
    <div>
      ready: {JSON.stringify(ready)}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  )
}

export function UseIntervalExample() {
  const [time, setTime] = useState(new Date())
  const { start, stop } = useInterval({
    duration: 1000,
    callback: () => {
      setTime(new Date())
    },
  })
  return (
    <div>
      time: {time.toLocaleString()}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  )
}
