# clamp

将数值限制在指定范围内。

## 类型签名

```ts
function clamp(value: number, min: number, max?: number): number
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { clamp } from '@fexd/tools'

export default () => {
  const [value, setValue] = useState(50)
  const [min, setMin] = useState(20)
  const [max, setMax] = useState(80)

  const clamped = clamp(value, min, max)
  const isBelow = value < min
  const isAbove = value > max
  const inRange = !isBelow && !isAbove

  const toPct = (v) => `${v}%`

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}
      >
        {[
          { label: 'value', val: value, set: setValue, color: '#1890ff' },
          { label: 'min', val: min, set: setMin, color: '#52c41a' },
          { label: 'max', val: max, set: setMax, color: '#fa8c16' },
        ].map(({ label, val, set, color }) => (
          <div key={label} style={{ flex: 1, minWidth: 100 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
              <span style={{ color, fontWeight: 600 }}>{label}</span>
              <span style={{ float: 'right', fontFamily: 'monospace' }}>
                {val}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={val}
              onChange={(e) => set(+e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          height: 48,
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: toPct(min),
            right: toPct(100 - max),
            top: 0,
            bottom: 0,
            background: '#e6f7ff',
            border: '1px dashed #91d5ff',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: toPct(value),
            top: 4,
            bottom: 4,
            width: 3,
            background: isBelow ? '#ff4d4f' : isAbove ? '#ff4d4f' : '#1890ff',
            borderRadius: 2,
            transition: 'left 0.2s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: toPct(clamped),
            top: 8,
            bottom: 8,
            width: 3,
            background: '#52c41a',
            borderRadius: 2,
            transition: 'left 0.2s',
          }}
        />

        <span
          style={{
            position: 'absolute',
            left: toPct(min),
            bottom: 2,
            fontSize: 10,
            color: '#52c41a',
            transform: 'translateX(-50%)',
          }}
        >
          min:{min}
        </span>
        <span
          style={{
            position: 'absolute',
            left: toPct(max),
            bottom: 2,
            fontSize: 10,
            color: '#fa8c16',
            transform: 'translateX(-50%)',
          }}
        >
          max:{max}
        </span>
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          textAlign: 'center',
          background: inRange ? '#f6ffed' : '#fff2f0',
          border: `1px solid ${inRange ? '#b7eb8f' : '#ffa39e'}`,
          fontSize: 15,
          transition: 'all 0.3s',
        }}
      >
        <code style={{ fontFamily: 'monospace' }}>
          clamp(<strong style={{ color: '#1890ff' }}>{value}</strong>,
          <strong style={{ color: '#52c41a' }}> {min}</strong>,
          <strong style={{ color: '#fa8c16' }}> {max}</strong>) =
          <strong
            style={{
              fontSize: 20,
              color: inRange ? '#52c41a' : '#ff4d4f',
              marginLeft: 8,
            }}
          >
            {clamped}
          </strong>
        </code>
        {!inRange && (
          <div style={{ fontSize: 12, color: '#ff4d4f', marginTop: 4 }}>
            {isBelow
              ? `⬇️ ${value} < min(${min})，被拉回到 ${min}`
              : `⬆️ ${value} > max(${max})，被拉回到 ${max}`}
          </div>
        )}
      </div>
    </div>
  )
}
```

## 参数

| 参数    | 类型     | 必填 | 默认值             | 说明       |
| ------- | -------- | ---- | ------------------ | ---------- |
| `value` | `number` | 是   | —                  | 要限制的值 |
| `min`   | `number` | 是   | —                  | 最小值     |
| `max`   | `number` | 否   | `Number.MAX_VALUE` | 最大值     |

## 返回值

`number` — 若 `value < min` 返回 `min`，若 `value > max` 返回 `max`，否则返回 `value`。

## 示例

### 代码用法

```ts
import { clamp } from '@fexd/tools'

clamp(5, 0, 10) // => 5（范围内）
clamp(-3, 0, 10) // => 0（低于下界）
clamp(15, 0, 10) // => 10（超过上界）
clamp(5, 0) // => 5（不设上界，默认 MAX_VALUE）
```

## 注意

- 当 `min > max` 时，两个边界判断可能互相矛盾，结果不一定落在 `[min, max]` 区间内。
- 省略 `max` 时默认 `Number.MAX_VALUE`，相当于只限制下界。
- 仅接受 `number` 类型，不会对字符串做隐式转换。

## 另见

- [`toFixed`](./toFixed) — 保留指定小数位
- [`expandScientificNumberString`](./expandScientificNumberString) — 展开科学计数法字符串
