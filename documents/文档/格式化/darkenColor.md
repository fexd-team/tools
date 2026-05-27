# darkenColor

将 Hex 颜色加深指定百分比。

## 类型签名

```ts
const darkenColor = (hexColor: string, percentage: number): string
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { darkenColor, getBrightness } from '@fexd/tools'

const PRESETS = [
  '#ff4d4f',
  '#fa8c16',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#eb2f96',
]

export default () => {
  const [color, setColor] = useState('#1890ff')
  const [pct, setPct] = useState(30)

  const steps = Array.from({ length: 11 }, (_, i) => i * 10)
  const darkened = darkenColor(color, pct)
  const textColor = (hex) => (getBrightness(hex) > 128 ? '#333' : '#fff')

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: 40,
            height: 34,
            border: 'none',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        />
        {PRESETS.map((c) => (
          <span
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: c,
              cursor: 'pointer',
              border: c === color ? '3px solid #333' : '2px solid #e8e8e8',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>
          加深
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => setPct(+e.target.value)}
          style={{ flex: 1 }}
        />
        <code style={{ fontSize: 13, minWidth: 42 }}>{pct}%</code>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 2,
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {steps.map((p) => {
          const c = darkenColor(color, p)
          return (
            <div
              key={p}
              onClick={() => setPct(p)}
              style={{
                flex: 1,
                height: 48,
                background: c,
                cursor: 'pointer',
                position: 'relative',
                outline: p === pct ? '2px solid #333' : 'none',
                outlineOffset: -2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 4,
              }}
            >
              <span style={{ fontSize: 10, color: textColor(c), opacity: 0.8 }}>
                {p}%
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 8,
            background: color,
            textAlign: 'center',
            color: textColor(color),
            fontSize: 13,
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: 11, opacity: 0.7 }}>原色</div>
          <div
            style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 600 }}
          >
            {color}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>
          →
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 8,
            background: darkened,
            textAlign: 'center',
            color: textColor(darkened),
            fontSize: 13,
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            darkenColor('{color}', {pct})
          </div>
          <div
            style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 600 }}
          >
            {darkened}
          </div>
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
        {`darkenColor('${color}', ${pct})  // => '${darkened}'`}
      </pre>

      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        <div style={{ marginBottom: 4 }}>色阶（点击选取）:</div>
        <div style={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
          {steps.map((p) => (
            <div key={p}>
              <span style={{ color: '#999' }}>
                darkenColor('{color}', {p})
              </span>
              {' → '}
              <span style={{ color: darkenColor(color, p), fontWeight: 600 }}>
                {darkenColor(color, p)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 参数

| 参数         | 类型     | 必填 | 默认值 | 说明                         |
| ------------ | -------- | ---- | ------ | ---------------------------- |
| `hexColor`   | `string` | 是   | —      | `#rrggbb` 格式的十六进制颜色 |
| `percentage` | `number` | 是   | —      | 加深百分比（0–100）          |

## 返回值

`string` — 加深后的 `#rrggbb` 格式颜色字符串。

## 示例

```ts
import { darkenColor } from '@fexd/tools'

darkenColor('#ffffff', 50) // => '#7f7f7f'（白色加深 50%）
darkenColor('#ff0000', 20) // => '#cc0000'（红色加深 20%）
darkenColor('#336699', 0) // => '#336699'（不变）
```

## 注意

- 每个通道按 `value * (1 - percentage / 100)` 计算，结果限定在 `[0, 255]`。
- 输入必须为 6 位 Hex 格式（`#rrggbb`），不支持 3 位简写或 `rgb()` 格式。

## 另见

- [`getBrightness`](./getBrightness) — 获取颜色亮度
- [`randomRGB`](./randomRGB) — 随机生成颜色
