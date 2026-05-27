# throttle

节流函数：在指定时间间隔内只执行一次，首次立即执行，末次调用也会执行。

## 类型签名

```ts
const throttle = <T extends AnyFunction>(func: T, wait?: number): T
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { throttle } from '@fexd/tools'

export default () => {
  const [rawCount, setRawCount] = useState(0)
  const [throttleCount, setThrottleCount] = useState(0)

  const [throttledFn] = useState(() =>
    throttle(() => setThrottleCount((c) => c + 1), 500)
  )

  const handleClick = () => {
    setRawCount((c) => c + 1)
    throttledFn()
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
          节流后执行次数:{' '}
          <strong style={{ color: '#52c41a' }}>{throttleCount}</strong>
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
        {`const throttledFn = throttle(() => execute(), 500)
// 快速点击 ${rawCount} 次，实际执行 ${throttleCount} 次
// 每 500ms 最多执行一次（首次立即执行）`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数   | 类型     | 必填 | 默认值 | 说明                 |
| ------ | -------- | ---- | ------ | -------------------- |
| `func` | `T`      | 是   | —      | 要节流的函数         |
| `wait` | `number` | 否   | `16`   | 最小执行间隔（毫秒） |

## 返回值

`T` — 节流后的函数。

## 示例

### 代码用法

```ts
import { throttle } from '@fexd/tools'

const handleScroll = throttle((event) => {
  console.log('scrolling:', event.target.scrollTop)
}, 100)

window.addEventListener('scroll', handleScroll)
```

## 注意

- 首次调用立即执行。
- 后续在 `wait` 毫秒内的调用被节流，最后一次调用会在间隔结束后补执行。
- 默认 `wait` 为 `16` 毫秒（约一帧时间）。

## 另见

- [`debounce`](./debounce) — 防抖函数
