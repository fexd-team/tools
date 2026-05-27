# memoize

缓存函数结果，相同参数再次调用时直接返回缓存值。

## 类型签名

```ts
interface CachedFunction extends Function {
  cache: Map<any, any>
}

const memoize = <T>(
  func: Function,
  options?: {
    disable?: (ctx: { cache: Map<any, any>; key: any; result: T; drop: () => void }) => boolean
  }
): CachedFunction
```

## 交互演示

```jsx
import React, { useState, useRef } from 'react'
import { memoize } from '@fexd/tools'

export default () => {
  const [input, setInput] = useState(5)
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({ hit: 0, miss: 0 })
  const idRef = useRef(0)

  const [fn] = useState(() =>
    memoize((n) => {
      const start = Date.now()
      let r = 0
      for (let i = 0; i < 1e6; i++) r += Math.sin(n + i)
      return { result: r.toFixed(4), cost: Date.now() - start }
    })
  )

  const call = () => {
    const hadCache = fn.cache.has(input)
    const { result, cost } = fn(input)
    const type = hadCache ? 'hit' : 'miss'
    setStats((s) => ({ ...s, [type]: s[type] + 1 }))
    setLogs((p) =>
      [
        {
          id: ++idRef.current,
          arg: input,
          result,
          cost: hadCache ? 0 : cost,
          type,
          time: new Date().toLocaleTimeString(),
        },
        ...p,
      ].slice(0, 15)
    )
  }

  const clear = () => {
    fn.cache.clear()
    setStats({ hit: 0, miss: 0 })
    setLogs([])
  }
  const total = stats.hit + stats.miss
  const hitRate = total > 0 ? ((stats.hit / total) * 100).toFixed(0) : '—'

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 13, color: '#999' }}>参数</span>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(+e.target.value)}
          style={{
            width: 70,
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            fontSize: 14,
            textAlign: 'center',
          }}
        />
        <button
          onClick={call}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#1890ff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          🧮 计算
        </button>
        <button
          onClick={clear}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            color: '#999',
          }}
        >
          🗑 清空缓存
        </button>
        <span style={{ fontSize: 12, color: '#999' }}>
          缓存 {fn.cache.size} 项 | 命中率{' '}
          <strong style={{ color: '#52c41a' }}>{hitRate}%</strong>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background: '#f0f0f0',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {total > 0 && (
            <>
              <div
                style={{
                  width: `${(stats.hit / total) * 100}%`,
                  background: '#52c41a',
                  transition: 'width 0.3s',
                }}
              />
              <div
                style={{
                  width: `${(stats.miss / total) * 100}%`,
                  background: '#ff4d4f',
                  transition: 'width 0.3s',
                }}
              />
            </>
          )}
        </div>
        <span style={{ fontSize: 11, color: '#52c41a' }}>HIT {stats.hit}</span>
        <span style={{ fontSize: 11, color: '#ff4d4f' }}>
          MISS {stats.miss}
        </span>
      </div>

      <div
        style={{
          borderRadius: 8,
          border: '1px solid #f0f0f0',
          maxHeight: 220,
          overflowY: 'auto',
          background: '#fafafa',
        }}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              padding: '5px 12px',
              borderBottom: '1px solid #f5f5f5',
              fontSize: 13,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#aaa', fontSize: 11, minWidth: 60 }}>
              {log.time}
            </span>
            <span
              style={{
                padding: '1px 8px',
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 600,
                background: log.type === 'hit' ? '#f6ffed' : '#fff2f0',
                color: log.type === 'hit' ? '#52c41a' : '#ff4d4f',
              }}
            >
              {log.type === 'hit' ? '🟢 HIT' : '🔴 MISS'}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
              fn({log.arg})
            </span>
            <span style={{ color: '#999', fontSize: 11 }}>
              {log.cost}ms → {log.result}
            </span>
          </div>
        ))}
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
        {`const fn = memoize((n) => heavyCompute(n))
fn(${input})  // ${fn.cache.has(input) ? `→ 缓存命中 (0ms)` : `→ 首次计算`}
fn.cache.size // => ${fn.cache.size}`}
      </pre>
      <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
        💡 相同参数第二次调用时 0ms 返回缓存 · 换个参数试试看 MISS
      </p>
    </div>
  )
}
```

## 参数

| 参数              | 类型       | 必填 | 默认值        | 说明                                                   |
| ----------------- | ---------- | ---- | ------------- | ------------------------------------------------------ |
| `func`            | `Function` | 是   | —             | 要缓存的函数                                           |
| `options.disable` | `Function` | 否   | `() => false` | 判断是否跳过缓存的回调，返回 `true` 则该次结果不被缓存 |

## 返回值

`CachedFunction` — 缓存化函数，附带 `.cache` 属性（`Map` 对象）。

## 示例

### 代码用法

```ts
import { memoize } from '@fexd/tools'

// 基本用法：缓存首次结果
const expensiveCalc = memoize((n) => {
  console.log('computing...')
  return n * 2
})

expensiveCalc(5) // => computing... 10
expensiveCalc(5) // => 10（直接返回缓存，不再计算）

// 条件跳过缓存
const cachedFetch = memoize(fetchData, {
  disable: ({ result }) => result.error, // 出错时不缓存
})

// 访问缓存
cachedFetch.cache // => Map { 5 => 10 }

// 清空缓存
cachedFetch.cache.clear()
```

## 注意

- 缓存键基于函数的**第一个参数**，其余参数不参与缓存判断。
- `options.disable` 回调中的 `drop()` 方法可以只删除当前键的缓存。
- `this` 上下文会在调用时保留。

## 另见

- [`lock`](./lock) — 带锁定机制的函数缓存
