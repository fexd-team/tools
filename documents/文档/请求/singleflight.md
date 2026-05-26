# singleflight

同一时刻对同一异步请求统一等待，避免重复发起（singleflight 模式）。

> 旧名 `SAS`（Single Advisory Service）仍可使用，但建议迁移到 `singleflight`。

## 类型签名

```ts
const singleflight = <T = any>(query: () => Promise<T>): SingleflightFunction<T>

type SingleflightFunction<T> = (() => Promise<T>) & {
  unlock: () => void
  isLocked: () => boolean
}
```

## 交互演示

```jsx
import React, { useState, useRef } from 'react'
import { singleflight, delay } from '@fexd/tools'

export default () => {
  const [logs, setLogs] = useState([])
  const [requesting, setRequesting] = useState(false)
  const [reqCount, setReqCount] = useState(0)
  const [actualCount, setActualCount] = useState(0)
  const idRef = useRef(0)

  const addLog = (msg, type = 'info') => {
    setLogs((prev) => [{ id: ++idRef.current, msg, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20))
  }

  const [fetchData] = useState(() =>
    singleflight(async () => {
      setActualCount((c) => c + 1)
      setRequesting(true)
      addLog('🚀 实际发起请求...', 'request')
      await delay(2000)
      const result = `数据 #${Math.floor(Math.random() * 9000 + 1000)}`
      addLog(`✅ 请求完成: ${result}`, 'success')
      setRequesting(false)
      return result
    })
  )

  const callOnce = async () => {
    setReqCount((c) => c + 1)
    addLog('📞 调用 fetchData()', 'call')
    const result = await fetchData()
    addLog(`📦 拿到结果: ${result}`, 'result')
  }

  const callBurst = async () => {
    addLog('⚡ 同时发起 5 次调用', 'burst')
    setReqCount((c) => c + 5)
    const results = await Promise.all([
      fetchData(), fetchData(), fetchData(), fetchData(), fetchData()
    ])
    addLog(`📦 5 次调用全部拿到相同结果: ${results[0]}`, 'result')
  }

  const reset = () => {
    setLogs([])
    setReqCount(0)
    setActualCount(0)
  }

  const btnStyle = { padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, border: '1px solid #d9d9d9' }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={callOnce} style={{ ...btnStyle, background: '#1890ff', color: '#fff', border: '1px solid #1890ff' }}>
          调用一次
        </button>
        <button onClick={callBurst} style={{ ...btnStyle, background: '#722ed1', color: '#fff', border: '1px solid #722ed1' }}>
          并发 5 次
        </button>
        <button onClick={reset} style={{ ...btnStyle, color: '#999' }}>🔄 重置</button>
        {requesting && <span style={{ fontSize: 12, color: '#fa8c16' }}>⏳ 请求中...</span>}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, textAlign: 'center',
          background: '#e6f7ff', border: '1px solid #91d5ff',
        }}>
          <div style={{ fontSize: 11, color: '#999' }}>调用次数</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>{reqCount}</div>
        </div>
        <div style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, textAlign: 'center',
          background: '#f6ffed', border: '1px solid #b7eb8f',
        }}>
          <div style={{ fontSize: 11, color: '#999' }}>实际请求次数</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>{actualCount}</div>
        </div>
        <div style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, textAlign: 'center',
          background: '#fff7e6', border: '1px solid #ffd591',
        }}>
          <div style={{ fontSize: 11, color: '#999' }}>节省请求</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fa8c16' }}>{reqCount - actualCount}</div>
        </div>
      </div>

      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginBottom: 12 }}>
{`const fetchData = singleflight(async () => {
  await delay(2000)
  return result
})
// 调用 ${reqCount} 次，实际只发起 ${actualCount} 次请求
// 请求期间的并发调用共享同一个 Promise`}
      </pre>

      <div style={{
        borderRadius: 8, border: '1px solid #f0f0f0', maxHeight: 200,
        overflowY: 'auto', background: '#fafafa',
      }}>
        {logs.length === 0 ? (
          <div style={{ padding: 12, fontSize: 12, color: '#ccc', textAlign: 'center' }}>
            点击按钮触发调用...
          </div>
        ) : logs.map((log) => (
          <div key={log.id} style={{
            padding: '4px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 12,
            color: log.type === 'request' ? '#1890ff' : log.type === 'success' ? '#52c41a' :
              log.type === 'burst' ? '#722ed1' : log.type === 'result' ? '#389e0d' : '#666',
          }}>
            <span style={{ color: '#bbb', marginRight: 8 }}>{log.time}</span>
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
| `query` | `() => Promise<T>` | 是 | — | 异步查询函数 |

## 返回值

`() => Promise<T>` — 封装后的函数。并发调用共享同一 Promise，请求完成后自动解锁。

## 示例

```ts
import { singleflight, delay } from '@fexd/tools'

// 模拟耗时请求
const fetchData = singleflight(async () => {
  await delay(2000)
  return { data: 'hello' }
})

// 同时发起多次请求，只执行一次
const [r1, r2, r3] = await Promise.all([
  fetchData(),
  fetchData(),  // 复用同一 Promise
  fetchData(),  // 复用同一 Promise
])
// r1 === r2 === r3，只产生一次实际网络请求

// 请求完成后再次调用会重新发起
const r4 = await fetchData()  // 新的请求
```

## 使用场景

### 1. 用户信息获取（多组件共享）

```ts
// 多个组件同时需要用户信息，但只想请求一次
const getUser = singleflight(() => fetch('/api/user').then(r => r.json()))

// ComponentA 中
const user = await getUser()

// ComponentB 中（同时刻调用，共享请求）
const user = await getUser()
```

### 2. 配置初始化

```ts
const loadConfig = singleflight(async () => {
  const res = await fetch('/api/config')
  return res.json()
})

// 应用启动时多处同时调用
await Promise.all([
  initModuleA(loadConfig),   // 内部 await loadConfig()
  initModuleB(loadConfig),   // 共享同一请求
  initModuleC(loadConfig),
])
```

### 3. 与 lock 的区别

```ts
// lock: 首次执行后永久锁定，后续返回缓存结果（不再请求）
const lockedFn = lock(fetchData)
await lockedFn()  // 执行
await lockedFn()  // 锁定，返回缓存

// singleflight: 请求执行中合并，完成后自动解锁（可重新请求）
const sf = singleflight(fetchData)
await sf()  // 执行
await sf()  // 若上次已完成 → 重新执行
```

## 注意

- 使用 `lock` 机制实现：请求执行期间自动加锁，所有调用者共享同一个 Promise。
- 请求结束（无论成功或失败）后自动解锁，下次调用会重新发起请求。
- 与 `memoize` 不同：`singleflight` 不做持久缓存，仅在执行期间合并并发调用。
- 旧名 `SAS` 仍可用（`import { SAS } from '@fexd/tools'`），但标记为 deprecated。

## 另见

- [`lock`](../函数/lock) — 函数锁定机制（永久缓存直到手动解锁）
- [`memoize`](../函数/memoize) — 函数缓存（基于参数持久缓存）
- [`createCachedRequest`](./createCachedRequest) — 带缓存的请求工厂