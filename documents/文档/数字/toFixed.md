# toFixed

对数字进行定点表示并返回 `number` 类型（而非字符串）。

## 类型签名

```ts
const toFixed = (num?: number, fractionDigits?: number): number
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { toFixed } from '@fexd/tools'

const TRICKY = [
  { label: '0.1+0.2', value: 0.1 + 0.2, note: '经典浮点精度' },
  { label: 'π', value: Math.PI, note: '圆周率' },
  { label: '1/3', value: 1 / 3, note: '无限循环' },
  { label: '2.005', value: 2.005, note: '原生 toFixed 陷阱' },
  { label: '1.255', value: 1.255, note: '舍入边界' },
]

export default () => {
  const [num, setNum] = useState(3.14159)
  const [digits, setDigits] = useState(2)

  const result = toFixed(num, digits)
  const nativeResult = Number(num.toFixed(digits))

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {TRICKY.map((t) => (
          <button key={t.label} onClick={() => setNum(t.value)} style={{
            padding: '3px 10px', borderRadius: 4, border: '1px solid #d9d9d9',
            background: '#fff', cursor: 'pointer', fontSize: 12,
          }} title={t.note}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>数字</div>
          <input type="number" step="any" value={num} onChange={(e) => setNum(+e.target.value)} style={{
            width: 150, padding: '6px 10px', borderRadius: 6, border: '1px solid #d9d9d9',
            fontSize: 14, fontFamily: 'monospace',
          }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>小数位 ({digits})</div>
          <input type="range" min={0} max={10} value={digits} onChange={(e) => setDigits(+e.target.value)}
            style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{
          flex: 1, padding: 16, borderRadius: 8, textAlign: 'center',
          background: '#f6ffed', border: '1px solid #b7eb8f',
        }}>
          <div style={{ fontSize: 11, color: '#999' }}>toFixed (本库)</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: '#389e0d' }}>
            {result}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>类型: {typeof result}</div>
        </div>
        <div style={{
          flex: 1, padding: 16, borderRadius: 8, textAlign: 'center',
          background: '#fafafa', border: '1px solid #e8e8e8',
        }}>
          <div style={{ fontSize: 11, color: '#999' }}>原生 Number.toFixed</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: '#666' }}>
            {nativeResult}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>类型: {typeof nativeResult}</div>
        </div>
      </div>

      {result !== nativeResult && (
        <div style={{
          padding: '6px 12px', borderRadius: 6, background: '#fff7e6',
          border: '1px solid #ffe58f', fontSize: 12, color: '#d48806',
        }}>
          ⚠️ 结果不一致！原生: {nativeResult} vs 本库: {result}
        </div>
      )}

      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginTop: 8 }}>
{`toFixed(${num}, ${digits})  // => ${result}  (number)
// 原生: Number((${num}).toFixed(${digits})) => ${nativeResult}`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `num` | `number` | 否 | `0` | 要处理的数字 |
| `fractionDigits` | `number` | 否 | `2` | 保留的小数位数 |

## 返回值

`number` — 保留指定小数位后的数字。

## 示例

```ts
import { toFixed } from '@fexd/tools'

toFixed(3.14159)     // => 3.14
toFixed(3.14159, 3)  // => 3.142
toFixed(3.1, 4)      // => 3.1
toFixed()            // => 0
```

## 注意

- 与原生 `Number.toFixed()` 不同，本函数返回 `number` 而非 `string`，避免后续运算时的类型转换。
- 内部使用 `Number(num.toFixed(fractionDigits))`，舍入规则与原生 `Number.prototype.toFixed` 一致。

## 另见

- [`clamp`](./clamp) — 数值范围限定
- [`expandScientificNumberString`](./expandScientificNumberString) — 展开科学计数法字符串
