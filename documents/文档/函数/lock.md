# lock

为函数添加自动锁定机制：首次执行后自动锁定，后续调用返回缓存结果，直到手动解锁。
## 类型签名
```ts
interface LockedFunction extends Function {
  unlock: () => void
  isLocked: () => boolean
}

interface LockConfig {
  always?: Function
  locking?: Function
}

const lock = <T>(func: Function, conf?: LockConfig): LockedFunction
```

## 交互演示
```jsx
import React, { useState, useRef } from 'react'
import { lock } from '@fexd/tools'

export default () => {
  const [logs, setLogs] = useState([])
  const [locked, setLocked] = useState(false)
  const idRef = useRef(0)
  const fnRef = useRef(null)

  const addLog = (msg, type) => {
    setLogs((p) => [{ id: ++idRef.current, msg, type, time: new Date().toLocaleTimeString() }, ...p].slice(0, 12))
  }

  if (!fnRef.current) {
    fnRef.current = lock(
      async () => {
        addLog('⏳ 请求发送中...', 'loading')
        await new Promise((r) => setTimeout(r, 1500))
        const result = `订单 #${Math.floor(Math.random() * 9000 + 1000)}`
        addLog(`✅ 请求成功: ${result}`, 'success')
        return result
      },
      {
        always: () => addLog('📌 always 回调触发', 'info'),
        locking: () => addLog('🔒 已锁定，跳过重复调用', 'warn'),
      }
    )
  }

  const handleSubmit = async () => {
    await fnRef.current()
    setLocked(fnRef.current.isLocked())
  }

  const handleUnlock = () => {
    fnRef.current.unlock()
    setLocked(fnRef.current.isLocked())
    addLog('🔓 已解锁', 'unlock')
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <button onClick={handleSubmit} style={{
          padding: '8px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
          border: 'none', background: locked ? '#f5f5f5' : '#1890ff',
          color: locked ? '#999' : '#fff', transition: 'all 0.3s',
        }}>
          {locked ? '🔒 已锁定 — 再次点击无效' : '📤 提交订单'}
        </button>
        <button onClick={handleUnlock} style={{
          padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
          border: '1px solid #fa8c16', background: '#fff7e6', color: '#fa8c16',
        }}>🔓 解锁</button>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: 12,
          background: locked ? '#fff1f0' : '#f6ffed',
          color: locked ? '#cf1322' : '#389e0d',
        }}>
          {locked ? '● 已锁定' : '○ 未锁定'}
        </span>
      </div>

      <p style={{ color: '#999', fontSize: 12, margin: '0 0 12px' }}>
        💡 点击提交后函数自动锁定，后续点击不会重复执行。点击「解锁」后可再次提交
      </p>

      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginBottom: 12 }}>
{`const lockedFn = lock(submitOrder, { always, locking })
lockedFn()          // ${locked ? '→ 已锁定，触发 locking 回调' : '→ 执行 submitOrder'}
lockedFn.isLocked() // => ${locked}
lockedFn.unlock()   // 解锁后可再次执行`}
      </pre>

      <div style={{
        borderRadius: 8, border: '1px solid #f0f0f0', maxHeight: 200,
        overflowY: 'auto', background: '#fafafa',
      }}>
        {logs.map((log) => (
          <div key={log.id} style={{
            padding: '5px 12px', borderBottom: '1px solid #f5f5f5',
            fontSize: 13, display: 'flex', gap: 8,
            color: log.type === 'warn' ? '#fa8c16' : log.type === 'success' ? '#389e0d' : log.type === 'loading' ? '#1890ff' : '#666',
          }}>
            <span style={{ color: '#bbb', fontSize: 11 }}>{log.time}</span>
            {log.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `func` | `Function` | 是 | — | 要锁定的函数 |
| `conf.always` | `Function` | 否 | — | 每次调用都触发的回调（无论是否已锁） |
| `conf.locking` | `Function` | 否 | — | 已锁状态下调用时触发的回调 |

## 返回值
`LockedFunction` — 锁定后的函数，附加 `unlock()` 和 `isLocked()` 方法。

## 方法
| 方法 | 说明 |
|------|------|
| `unlock()` | 解除锁定，下次调用将重新执行函数 |
| `isLocked()` | 返回当前是否已锁定 |

## 示例
### 代码用法

```ts
import { lock } from '@fexd/tools'

const lockedFetch = lock(async () => {
  const res = await fetch('/api/data')
  return res.json()
})

// 首次调用：执行函数
await lockedFetch()    // 执行 fetch
// 后续调用：返回缓存结果
await lockedFetch()    // 不执行，返回上次结果

// 解锁后可重新执行
lockedFetch.unlock()
await lockedFetch()    // 再次执行 fetch

// 检查锁定状态
lockedFetch.isLocked() // => true / false
```

## 注意
- 锁定基于 `memoize` 实现，缓存键为函数引用本身。
- 解锁后再次调用会重新执行并缓存新结果。

## 另见
- [`memoize`](./memoize) — 函数结果缓存
- [`singleflight`](../请求/singleflight) — 并发请求合并（singleflight 模式，旧名 SAS）
