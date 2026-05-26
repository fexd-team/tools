# createSeparatorFormatter

创建分隔符格式化函数，用于按分组插入分隔符（如数字千分位、银行卡号分组等）。

> 原名 `getFormatter`，已保留为别名。

## 类型签名
```ts
const createSeparatorFormatter = (options?: {
  separator?: string          // default: ' '
  length?: number             // default: 3
  reverse?: boolean           // default: false
  isNumber?: boolean          // default: false
  decimalSeparator?: string   // default: 自动推断
}) => (text: any): string
```

## 交互演示
```jsx
import React, { useState, useMemo } from 'react'
import { createSeparatorFormatter } from '@fexd/tools'

const presets = [
  { label: '🇺🇸 美式 1,234.56', sep: ',', decimal: '' },
  { label: '🇩🇪 欧式 1.234,56', sep: '.', decimal: '' },
  { label: '🇫🇷 法式 1 234,56', sep: ' ', decimal: ',' },
  { label: '🇨🇭 瑞士 1\'234.56', sep: "'", decimal: '.' },
]

export default () => {
  const [input, setInput] = useState('1234567.89')
  const [sep, setSep] = useState(',')
  const [decimal, setDecimal] = useState('')

  const opts = useMemo(() => {
    const o = { separator: sep, isNumber: true }
    if (decimal) o.decimalSeparator = decimal
    return o
  }, [sep, decimal])

  const fmt = createSeparatorFormatter(opts)
  const result = fmt(input)

  const resolvedDecimal = decimal || (sep === '.' ? ',' : '.')

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => { setSep(p.sep); setDecimal(p.decimal) }}
            style={{
              padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
              border: sep === p.sep && decimal === p.decimal ? '2px solid #1890ff' : '1px solid #d9d9d9',
              background: sep === p.sep && decimal === p.decimal ? '#e6f7ff' : '#fff',
              fontSize: 13,
            }}
          >{p.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '4px 8px', width: 160, borderRadius: 4, border: '1px solid #d9d9d9' }}
          placeholder="输入数字"
        />
        <label style={{ fontSize: 13 }}>
          分组: <select value={sep} onChange={(e) => setSep(e.target.value)} style={{ padding: 4 }}>
            <option value=",">,</option>
            <option value=".">.</option>
            <option value=" ">空格</option>
            <option value="'"> ' </option>
            <option value="_">_</option>
          </select>
        </label>
        <label style={{ fontSize: 13 }}>
          小数点: <select value={decimal} onChange={(e) => setDecimal(e.target.value)} style={{ padding: 4 }}>
            <option value="">自动 ({resolvedDecimal})</option>
            <option value=".">.</option>
            <option value=",">,</option>
            <option value="·">·</option>
          </select>
        </label>
      </div>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#13c2c2', letterSpacing: 1, marginBottom: 8 }}>
        {result}
      </div>
      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginTop: 8 }}>
{`const fmt = createSeparatorFormatter({ separator: '${sep}', isNumber: true${decimal ? `, decimalSeparator: '${decimal}'` : ''} })
fmt('${input}')  // => '${result}'`}
      </pre>
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `options.separator` | `string` | 否 | `' '` | 数字分组分隔符 |
| `options.length` | `number` | 否 | `3` | 每组字符数 |
| `options.reverse` | `boolean` | 否 | `false` | 是否从左到右分组 |
| `options.isNumber` | `boolean` | 否 | `false` | 是否使用数字模式（正确处理小数点） |
| `options.decimalSeparator` | `string` | 否 | 自动推断 | 小数点分隔符；未指定时当 `separator='.'` 自动用 `','`，否则用 `'.'` |

## 返回值
`(text: any) => string` — 格式化函数，接收文本返回格式化后的字符串。

## 示例

```ts
import { createSeparatorFormatter } from '@fexd/tools'

// 千分位分隔（默认空格）
const format = createSeparatorFormatter()
format(1234567)  // => '1 234 567'

// 美式：逗号分组，小数点不变
const formatUS = createSeparatorFormatter({ separator: ',', isNumber: true })
formatUS(1234567.89)  // => '1,234,567.89'

// 欧式：点分组 → 小数点自动变逗号
const formatEU = createSeparatorFormatter({ separator: '.', isNumber: true })
formatEU(1234567.89)  // => '1.234.567,89'

// 银行卡号 4 位分组
const formatCard = createSeparatorFormatter({ separator: ' ', length: 4 })
formatCard('6222021234567890')  // => '6222 0212 3456 7890'
```

## 注意
- 默认 `reverse: false` 时从右向左分组（千分位风格）；设为 `true` 则从左向右分组。
- 开启 `isNumber: true` 后才会正确处理小数点；未开启时数字会先 `Math.floor` 取整再格式化。
- 非数字模式下，`null`/`undefined` 会原样返回；数字模式下返回空字符串 `''`。
- 当 `separator` 为 `'.'` 且未指定 `decimalSeparator` 时，小数点分隔符会自动切换为 `','`，避免冲突（欧式格式）。

## 另见
- [`toFixed`](../数字/toFixed) — 保留指定小数位
- [`expandScientificNumberString`](../数字/expandScientificNumberString) — 展开科学计数法字符串
- `getFormatter` — 本函数的旧名（已废弃，保留兼容）
