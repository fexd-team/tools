# random

生成指定范围内的随机数，支持整数和浮点数。
## 类型签名
```ts
const random = (min: number, max: number, int?: boolean): number
```

## 交互演示
```jsx
import React, { useState } from 'react'
import { random } from '@fexd/tools'

export default () => {
  const [result, setResult] = useState(null)
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} style={{ width: 60, padding: 4 }} />
        <span>~</span>
        <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} style={{ width: 60, padding: 4 }} />
        <button onClick={() => setResult(random(min, max))} style={{ padding: '4px 16px' }}>生成随机整数</button>
        <button onClick={() => setResult(random(min, max, false))} style={{ padding: '4px 16px' }}>生成随机浮点</button>
      </div>
      {result !== null && (
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#722ed1', marginBottom: 8 }}>{result}</div>
      )}
      {result !== null && (
        <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555' }}>
{`random(${min}, ${max}${Number.isInteger(result) ? '' : ', false'})  // => ${result}`}
        </pre>
      )}
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `min` | `number` | 是 | — | 最小值 |
| `max` | `number` | 是 | — | 最大值（整数模式下不包含） |
| `int` | `boolean` | 否 | `true` | 是否返回整数 |

## 返回值
`number` — 范围 `[min, max)` 内的随机数。整数模式（`int = true`）使用 `Math.floor` 取整。

## 示例
### 代码用法

```ts
import { random } from '@fexd/tools'

random(1, 10)       // => 1~9 之间的随机整数（不含 10）
random(1, 10, true) // => 1~9 之间的随机整数
random(0, 1, false)  // => 0~1 之间的随机浮点数
```

## 注意
- `int = true`（默认）时，`max` 是**不包含**的上界（与 `Math.random` 行为一致）。
- `int = false` 时，返回 `[min, max)` 范围内的浮点数。

## 另见
- [`sample`](./sample) — 从数组随机取样
