# getBrightness

计算 Hex 颜色的感知亮度值（基于 ITU-R BT.601 标准）。

## 类型签名

```ts
const getBrightness = (hexColor: string): number
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { getBrightness, randomRGB } from '@fexd/tools'

const PRESETS = [
  { label: '纯白', hex: '#ffffff' },
  { label: '纯黑', hex: '#000000' },
  { label: '红色', hex: '#ff0000' },
  { label: '绿色', hex: '#00ff00' },
  { label: '蓝色', hex: '#0000ff' },
  { label: '黄色', hex: '#ffff00' },
  { label: '品红', hex: '#ff00ff' },
  { label: '青色', hex: '#00ffff' },
]

export default () => {
  const [color, setColor] = useState('#1890ff')
  const [history, setHistory] = useState(PRESETS.map((p) => p.hex))

  const brightness = getBrightness(color)
  const textColor = brightness > 128 ? '#000' : '#fff'
  const ratio = (brightness / 255) * 100
  const callExpr = `getBrightness('${color}') // => ${brightness.toFixed(1)}`

  const addRandom = () => {
    const c = randomRGB()
    setColor(c)
    setHistory((h) => [c, ...h].slice(0, 16))
  }

  return (
    <div>
      <div
        style={{
          padding: 24,
          borderRadius: 12,
          background: color,
          textAlign: 'center',
          color: textColor,
          transition: 'all 0.3s',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace' }}>
          {color}
        </div>
        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
          亮度 {brightness.toFixed(1)} / 255
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: 20,
            border: `1px solid ${textColor}`,
            fontSize: 13,
          }}
        >
          推荐使用 <strong>{brightness > 128 ? '深色' : '浅色'}</strong> 文字
        </div>
      </div>

      <div
        style={{
          height: 8,
          borderRadius: 4,
          marginBottom: 16,
          position: 'relative',
          background: 'linear-gradient(to right, #000, #fff)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${ratio}%`,
            top: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: color,
            border: '2px solid #333',
            transform: 'translateX(-50%)',
            transition: 'left 0.3s',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: 34, height: 30, border: 'none', cursor: 'pointer' }}
        />
        <button
          onClick={addRandom}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            fontSize: 13,
            background: '#fff',
          }}
        >
          🎲 随机颜色
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {history.map((hex, i) => {
          const b = getBrightness(hex)
          return (
            <div
              key={`${hex}-${i}`}
              onClick={() => setColor(hex)}
              style={{
                width: 44,
                height: 36,
                borderRadius: 6,
                background: hex,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: hex === color ? '2px solid #333' : '1px solid #e8e8e8',
                fontSize: 10,
                color: b > 128 ? '#333' : '#fff',
                fontFamily: 'monospace',
                transition: 'all 0.2s',
              }}
            >
              {b.toFixed(0)}
            </div>
          )
        })}
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
        {callExpr}
      </pre>
    </div>
  )
}
```

## 参数

| 参数       | 类型     | 必填 | 默认值 | 说明                         |
| ---------- | -------- | ---- | ------ | ---------------------------- |
| `hexColor` | `string` | 是   | —      | `#rrggbb` 格式的十六进制颜色 |

## 返回值

`number` — 亮度值，范围 `[0, 255]`。值越大颜色越亮。

## 示例

```ts
import { getBrightness } from '@fexd/tools'

getBrightness('#ffffff') // => 255（纯白）
getBrightness('#000000') // => 0（纯黑）
getBrightness('#ff0000') // => 76.245（红色）

// 常用于判断文字应使用深色还是浅色
const textColor = getBrightness(bgColor) > 128 ? '#000' : '#fff'
```

## 注意

- 公式为 `0.299 * R + 0.587 * G + 0.114 * B`（人眼对绿色最敏感）。
- 输入必须为 6 位 Hex 格式（`#rrggbb`）。

## 另见

- [`darkenColor`](./darkenColor) — 将颜色加深指定百分比
- [`randomRGB`](./randomRGB) — 随机生成颜色
