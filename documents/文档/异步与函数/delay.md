# delay

返回一个在指定时间后 resolve 的 Promise，可用于 `await` 暂停执行。

## 类型签名

```ts
const delay = (time?: number): Promise<void>
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { delay } from '@fexd/tools'

export default () => {
  const [status, setStatus] = useState('idle')
  const [seconds, setSeconds] = useState(3)

  const handleStart = async () => {
    for (let i = seconds; i > 0; i--) {
      setStatus(`⏳ ${i}...`)
      await delay(1000)
    }
    setStatus('✅ 完成！')
    await delay(2000)
    setStatus('idle')
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          style={{ padding: 4 }}
        >
          <option value={1}>1 秒</option>
          <option value={2}>2 秒</option>
          <option value={3}>3 秒</option>
          <option value={5}>5 秒</option>
        </select>
        <button
          onClick={handleStart}
          disabled={status !== 'idle'}
          style={{ padding: '4px 16px' }}
        >
          开始倒计时
        </button>
        <span style={{ fontSize: 20 }}>
          {status === 'idle' ? '💤 等待中' : status}
        </span>
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
        {`for (let i = ${seconds}; i > 0; i--) {
  setStatus(i + '...')
  await delay(1000)  // 暂停 1 秒
}
setStatus('完成！')`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数   | 类型     | 必填 | 默认值      | 说明             |
| ------ | -------- | ---- | ----------- | ---------------- |
| `time` | `number` | 否   | `undefined` | 延迟时间（毫秒） |

## 返回值

`Promise<void>` — 在指定时间后 resolve 的 Promise。

## 示例

### 代码用法

```ts
import { delay } from '@fexd/tools'

// 延迟 1 秒后继续执行
await delay(1000)
console.log('1 秒后')

// 不传参数时，在下一个事件循环 tick 执行
await delay()

// 结合 async/await 实现轮询
async function poll() {
  while (true) {
    const result = await checkStatus()
    if (result.done) break
    await delay(2000) // 每 2 秒检查一次
  }
}
```

## 注意

- 传入 `Infinity` 时 Promise **永远不会 resolve**，可用于创建永久挂起的效果。
- 不传参数或传 `undefined` 时，等同于 `Promise.resolve().then()`，在下一个微任务执行。

## 另见

- [`nextTick`](./nextTick) — 在下一个微任务执行
- [`catchPromise`](./catchPromise) — 安全包装 Promise
