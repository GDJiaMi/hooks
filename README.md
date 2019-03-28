# React Hooks 🚧

A collection for React Hooks

## Install

```shell
yarn add @gdjiami/hooks -D
#or
npm i @gdjiami/hooks --save-dev
```

## Usage

```jsx
import React, { useState } from 'react'
import {
  useToggle,
  useOnMount,
  useOnUnmount,
  useOnUpdate,
} from '@gdjiami/hooks'

export const Countter = () => {
  const [open, toggleOpen] = useToggle(true)
  const [counter, setCounter] = useState(0)

  useOnMount(() => {
    console.log('mounted')
  })

  useOnUpdate(() => {
    console.log('counter update:', counter)
  }, counter)

  useOnUnmount(() => {
    console.log('will unmount')
  })

  return (
    <div>
      <button onClick={toggleOpen}>{open ? 'on' : 'off'}</button>
      {open && (
        <div>
          <div>counter: {counter}</div>
          <div>
            <button onClick={() => setCounter(counter + 1)}>increase</button>
            <button onClick={() => setCounter(counter + 1)}>decrease</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Example

## Docs

## Related Project

- [react-hooks-global-state](https://github.com/dai-shi/react-hooks-global-state): 提供类 redux 的全局状态管理
- [react-spring](https://github.com/react-spring/react-spring): 弹性动画
- [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite): 配合 mobx 使用
- [rxjs-hooks](https://github.com/LeetCode-OpenSource/rxjs-hooks): 配合 rxjs 6 使用
