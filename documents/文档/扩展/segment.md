# segment

将一个数值随机分成若干段，每段长度在指定范围内。
## 类型签名
```ts
function segment(length: number, count: number, [min, max]: number[]): number[]
```

## 交互演示
```jsx
import React, { useState, useCallback } from 'react'
import { segment } from '@fexd/tools'

const BAR_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#faad14', '#f5222d', '#2f54eb', '#a0d911']

export default () => {
  const [length, setLength] = useState(100)
  const [count, setCount] = useState(5)
  const [min, setMin] = useState(10)
  const [max, setMax] = useState(30)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const generate = useCallback(() => {
    try {
      const r = segment(length, count, [min, max])
      setResult(r)
      setError(null)
    } catch (e) { setError(e.message); setResult(null) }
  }, [length, count, min, max])

  const total = result ? result.reduce((s, v) => s + v, 0) : 0

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 16 }}>
        {[
          { label: '总长度 (length)', val: length, set: setLength, min: 1, max: 500 },
          { label: '分段数 (count)', val: count, set: setCount, min: 1, max: 10 },
          { label: '段最小值 (min)', val: min, set: setMin, min: 0, max: 100 },
          { label: '段最大值 (max)', val: max, set: setMax, min: 0, max: 200 },
        ].map(({ label, val, set, ...range }) => (
          <div key={label}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>
              {label}: <strong>{val}</strong>
            </div>
            <input type="range" {...range} value={val} onChange={(e) => set(+e.target.value)}
              style={{ width: '100%' }} />
          </div>
        ))}
      </div>

      <button onClick={generate} style={{
        padding: '6px 20px', borderRadius: 6, border: 'none',
        background: '#1890ff', color: '#fff', cursor: 'pointer',
        fontSize: 14, marginBottom: 16,
      }}>🎲 生成分段</button>

      {error && (
        <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fff2f0', color: '#cf1322', fontSize: 13, marginBottom: 12 }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <>
          <div style={{
            display: 'flex', gap: 2, borderRadius: 8, overflow: 'hidden',
            height: 56, marginBottom: 12,
          }}>
            {result.map((val, i) => (
              <div key={i} style={{
                flex: val, background: BAR_COLORS[i % BAR_COLORS.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'monospace',
                transition: 'flex 0.3s', minWidth: 20,
              }}>{val.toFixed(1)}</div>
            ))}
          </div>

          <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555' }}>
{`segment(${length}, ${count}, [${min}, ${max}])
// => [${result.map((v) => v.toFixed(1)).join(', ')}]  (sum = ${total.toFixed(1)})`}
          </pre>
        </>
      )}
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `length` | `number` | 是 | — | 要分割的总长度 |
| `count` | `number` | 是 | — | 分成几段 |
| `[min, max]` | `number[]` | 是 | — | 每段的最小和最大长度 |

## 返回值
`number[]` — 分段后的长度数组，各段之和等于 `length`。

## 示例
### 代码用法

```ts
import { segment } from '@fexd/tools'

// 将 100 分成 5 段，每段长度在 10~30 之间
segment(100, 5, [10, 30])
// => [22, 15, 28, 18, 17]（每次结果不同）

// 将 50 分成 3 段，每段长度在 10~20 之间
segment(50, 3, [10, 20])
// => [16, 14, 20]
```

## 注意
- 若 `length / count` 超出 `[min, max]` 范围，会抛出错误 `'无法分段'`。
- 结果为浮点数，如需整数请传入整数的 `length` 并手动取整。

## 另见
- [`random`](../函数/random) — 随机数生成
- [`clamp`](../数字/clamp) — 数值范围限制
- [`sample`](../函数/sample) — 从数组随机取样
