import React from 'react'
import { usePoll } from '../src'
import { useState } from 'react'

export default function Example() {
  const [counter, setCounter] = useState(0)
  const { polling } = usePoll({
    condition: async () => counter % 2 === 0,
    poller: () => new Promise(res => setTimeout(res, 2000)),
    args: [counter],
  })

  return (
    <div>
      {polling ? 'polling' : 'stoped'}
      <div>condition: {counter} % 2 === 0</div>
      <button onClick={() => setCounter(counter + 1)}>Add</button>
      <button onClick={() => setCounter(counter - 1)}>decr</button>
    </div>
  )
}
