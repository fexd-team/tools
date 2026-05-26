# randomRGB

随机生成一个 Hex 格式的 RGB 颜色值。

## 类型签名

```ts
const randomRGB = (min?: number): string
```

## 交互演示

```jsx
import React, { useState, useCallback } from 'react'
import { randomRGB, getBrightness } from '@fexd/tools'

const genPalette = (count, min) => Array.from({ length: count }, () => randomRGB(min))

export default () => {
  const [min, setMin] = useState(0)
  const [cols, setCols] = useState(8)
  const [palette, setPalette] = useState(() => genPalette(24, 0))
  const [locked, setLocked] = useState(new Set())

  const refresh = useCallback(() => {
    setPalette((prev) =>
      prev.map((c, i) => locked.has(i) ? c : randomRGB(min))
    )
  }, [min, locked])

  const toggleLock = (i) => {
    setLocked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={refresh} style={{
          padding: '6px 16px', borderRadius: 6, border: '1px solid #1890ff',
          background: '#1890ff', color: '#fff', cursor: 'pointer', fontSize: 13,
        }}>🎲 生成调色盘</button>
        <span style={{ fontSize: 13, color: '#666' }}>最小亮度</span>
        <input type="range" min={0} max={200} value={min} onChange={(e) => setMin(+e.target.value)}
          style={{ width: 100 }} />
        <code style={{ fontSize: 12 }}>{min}</code>
        <span style={{ fontSize: 13, color: '#666' }}>列数</span>
        {[4, 6, 8].map((n) => (
          <button key={n} onClick={() => setCols(n)} style={{
            padding: '2px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
            border: '1px solid', borderColor: n === cols ? '#1890ff' : '#d9d9d9',
            background: n === cols ? '#e6f7ff' : '#fff', color: n === cols ? '#1890ff' : '#666',
          }}>{n}</button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 4, borderRadius: 8, overflow: 'hidden',
      }}>
        {palette.map((hex, i) => {
          const b = getBrightness(hex)
          const isLocked = locked.has(i)
          return (
            <div key={i} style={{
              height: 56, background: hex, position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <span onClick={() => toggleLock(i)} style={{
                position: 'absolute', top: 2, right: 4, fontSize: 12,
                opacity: isLocked ? 1 : 0.3,
              }}>{isLocked ? '🔒' : '🔓'}</span>
              <span style={{
                fontSize: 10, fontFamily: 'monospace', fontWeight: 600,
                color: b > 128 ? '#333' : '#fff',
              }}>{hex}</span>
            </div>
          )
        })}
      </div>

      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginTop: 12 }}>
{`randomRGB(${min})  // 每次调用随机生成，min=${min} 控制最低亮度
// 当前调色盘示例：
${palette.slice(0, 4).map((c) => `// randomRGB(${min}) → '${c}'`).join('\n')}`}
      </pre>
      <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
        💡 点击 🔓 锁定颜色，再次生成时保留锁定色
      </p>
    </div>
  )
}
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `min` | `number` | 否 | `0` | 每个通道的最小值（0–255），用于避免过暗的颜色 |

## 返回值

`string` — `#rrggbb` 格式的十六进制颜色字符串。

## 示例

```ts
import { randomRGB } from '@fexd/tools'

randomRGB()     // => '#a3f2c1'（随机）
randomRGB(128)  // => '#e4d8f0'（较亮的颜色）
```

## 注意

- 每个通道值范围为 `[min, 255)`（使用 `Math.floor`，上界取不到 255），传入 `min = 128` 可确保生成较亮的颜色。

## 另见

- [`darkenColor`](./darkenColor) — 将颜色加深指定百分比
- [`getBrightness`](./getBrightness) — 获取颜色亮度
- [`random`](../函数/random) — 随机数生成
