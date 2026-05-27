# debounce

防抖函数：在指定时间内只执行最后一次调用。

## 类型签名

```ts
type AnyFunction = (...args: any[]) => any

const debounce = <T extends AnyFunction>(
  func: T,
  wait?: number
): T & { cancel: () => void }
```

## 交互演示

```jsx
import React, { useState, useRef } from 'react'
import { debounce } from '@fexd/tools'

export default () => {
  const [rawCount, setRawCount] = useState(0)
  const [debounceCount, setDebounceCount] = useState(0)

  const [debouncedFn] = useState(() =>
    debounce(() => setDebounceCount((c) => c + 1), 500)
  )

  const handleClick = () => {
    setRawCount((c) => c + 1)
    debouncedFn()
  }

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ padding: '8px 16px', fontSize: 14 }}
      >
        快速点击我
      </button>
      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>
          原始触发次数: <strong>{rawCount}</strong>
        </div>
        <div>
          防抖后执行次数:{' '}
          <strong style={{ color: '#1890ff' }}>{debounceCount}</strong>
        </div>
      </div>
      <pre
        style={{
          background: '#f9f9f9',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          color: '#555',
          marginTop: 12,
        }}
      >
        {`const debouncedFn = debounce(() => execute(), 500)
// 快速点击 ${rawCount} 次，实际执行 ${debounceCount} 次
// 停止操作 500ms 后才触发一次`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数   | 类型     | 必填 | 默认值 | 说明                         |
| ------ | -------- | ---- | ------ | ---------------------------- |
| `func` | `T`      | 是   | —      | 要防抖的函数                 |
| `wait` | `number` | 否   | `16`   | 延迟时间（毫秒），约等于一帧 |

## 返回值

`T & { cancel }` — 防抖后的函数，附带 `cancel()` 方法取消待执行的调用。

## 方法

| 方法       | 说明                     |
| ---------- | ------------------------ |
| `cancel()` | 取消当前待执行的防抖调用 |

## 示例

### 代码用法

```ts
import { debounce } from '@fexd/tools'

const handleSearch = debounce((query) => {
  console.log('searching:', query)
}, 300)

// 多次快速调用只有最后一次生效
handleSearch('a')
handleSearch('ab')
handleSearch('abc')
// 300ms 后只执行一次：searching: abc

// 取消待执行的调用
handleSearch.cancel()
```

## 注意

- 每次调用会重置定时器，只有最后一次调用后的 `wait` 毫秒才会触发。
- 返回值是 timeout ID，不是原函数的返回值。
- 默认 `wait` 为 `16` 毫秒（约一帧时间）。

## 另见

- [`throttle`](./throttle) — 节流函数
