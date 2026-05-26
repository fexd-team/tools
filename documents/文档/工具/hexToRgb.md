# hexToRgb

将十六进制颜色字符串解析为 RGB(A) 对象。

## 类型签名

```ts
const hexToRgb = (hex: string): { r: number; g: number; b: number; a?: number }
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { hexToRgb } from '@fexd/tools'

export default () => {
  const [hex, setHex] = useState('#1890ffcc')
  const rgb = hexToRgb(hex)

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <input type="color" value={hex.slice(0, 7)} onChange={(e) => setHex(e.target.value + hex.slice(7))}
          style={{ width: 48, height: 36, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 14, padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, padding: 12, borderRadius: 8, background: '#fee', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#f44' }}>{rgb.r}</div>
        </div>
        <div style={{ flex: 1, padding: 12, borderRadius: 8, background: '#efe', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>G</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#4a4' }}>{rgb.g}</div>
        </div>
        <div style={{ flex: 1, padding: 12, borderRadius: 8, background: '#eef', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>B</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#44f' }}>{rgb.b}</div>
        </div>
        {rgb.a !== undefined && (
          <div style={{ flex: 1, padding: 12, borderRadius: 8, background: '#ffe', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#999' }}>A</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#a80' }}>{rgb.a}</div>
          </div>
        )}
      </div>
      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginTop: 12 }}>
{`hexToRgb('${hex}')
// => { r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}${rgb.a !== undefined ? `, a: ${rgb.a}` : ''} }`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `hex` | `string` | 是 | — | 十六进制颜色字符串，支持 `#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa` 格式 |

## 返回值

`{ r: number; g: number; b: number; a?: number }` — RGB 各通道值（0–255），含 alpha 时 `a` 为 0–1 浮点数；不含 alpha 时不返回 `a` 字段。

## 示例

```ts
import { hexToRgb } from '@fexd/tools'

// 6 位标准格式
hexToRgb('#ff0000')     // => { r: 255, g: 0, b: 0 }
hexToRgb('#1890ff')     // => { r: 24, g: 144, b: 255 }

// 3 位简写
hexToRgb('#fff')        // => { r: 255, g: 255, b: 255 }
hexToRgb('#ABC')        // => { r: 170, g: 187, b: 204 }

// 8 位带 alpha（CSS Color Level 4）
hexToRgb('#ff000080')   // => { r: 255, g: 0, b: 0, a: 0.5 }
hexToRgb('#1890ffcc')   // => { r: 24, g: 144, b: 255, a: 0.8 }

// 4 位简写带 alpha
hexToRgb('#f00f')       // => { r: 255, g: 0, b: 0, a: 1 }
hexToRgb('#0000')       // => { r: 0, g: 0, b: 0, a: 0 }
```

## 注意

- 支持所有 CSS Color Module Level 4 定义的 hex 格式：`#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa`
- 不含 alpha 的格式（3 位 / 6 位）不会返回 `a` 字段
- `a` 值为 0–1 浮点数（精确到小数点后 2 位）
- 大小写不敏感
- 不支持 `rgb()`/`hsl()` 函数格式

## 另见

- [`darkenColor`](./darkenColor) — 加深颜色
- [`getBrightness`](./getBrightness) — 计算颜色亮度
- [`randomRGB`](./randomRGB) — 随机生成颜色
