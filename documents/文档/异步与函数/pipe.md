# pipe

从左到右组合多个函数，前一个函数的返回值作为后一个函数的参数。

## 类型签名

```ts
const pipe = <T>(...handlers: Function[]) => (arg: any): T
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { pipe } from '@fexd/tools'

const TRANSFORMS = {
  '+1': { fn: (n) => n + 1, label: '+1', color: '#1890ff' },
  '×2': { fn: (n) => n * 2, label: '×2', color: '#52c41a' },
  '−3': { fn: (n) => n - 3, label: '−3', color: '#fa8c16' },
  '²': { fn: (n) => n ** 2, label: 'n²', color: '#722ed1' },
  '÷2': { fn: (n) => n / 2, label: '÷2', color: '#eb2f96' },
  abs: { fn: (n) => Math.abs(n), label: '|n|', color: '#13c2c2' },
  '%10': { fn: (n) => n % 10, label: '%10', color: '#faad14' },
  neg: { fn: (n) => -n, label: '−n', color: '#cf1322' },
}

export default () => {
  const [input, setInput] = useState(5)
  const [steps, setSteps] = useState(['+1', '×2', '−3'])

  const fns = steps.map((k) => TRANSFORMS[k].fn)
  const composed = fns.length > 0 ? pipe(...fns) : (x) => x

  const intermediates = []
  let val = input
  for (const k of steps) {
    val = TRANSFORMS[k].fn(val)
    intermediates.push({ key: k, value: val })
  }

  const result = composed(input)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 13, color: '#999' }}>输入</span>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(+e.target.value)}
          style={{
            width: 70,
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            fontSize: 16,
            fontWeight: 600,
            textAlign: 'center',
          }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>
          可用变换（点击添加到管道）
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(TRANSFORMS).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setSteps((p) => [...p, key])}
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                border: `1px solid ${color}`,
                background: '#fff',
                color,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setSteps([])}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid #d9d9d9',
              background: '#fafafa',
              cursor: 'pointer',
              fontSize: 12,
              color: '#999',
            }}
          >
            🗑 清空
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: '#fafafa',
          borderRadius: 8,
          marginBottom: 12,
          minHeight: 48,
        }}
      >
        <span
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            background: '#fff',
            border: '1px solid #d9d9d9',
            fontWeight: 700,
            fontSize: 16,
            fontFamily: 'monospace',
          }}
        >
          {input}
        </span>

        {steps.map((key, i) => {
          const t = TRANSFORMS[key]
          return (
            <React.Fragment key={i}>
              <span style={{ color: '#ccc', fontSize: 16 }}>→</span>
              <span
                onClick={() => setSteps((p) => p.filter((_, j) => j !== i))}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: t.color + '15',
                  border: `1px solid ${t.color}`,
                  color: t.color,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
                title="点击移除"
              >
                {t.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#999',
                  fontFamily: 'monospace',
                }}
              >
                = {intermediates[i]?.value}
              </span>
            </React.Fragment>
          )
        })}

        {steps.length > 0 && (
          <>
            <span style={{ color: '#ccc', fontSize: 16 }}>→</span>
            <span
              style={{
                padding: '4px 16px',
                borderRadius: 6,
                background: '#389e0d',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                fontFamily: 'monospace',
              }}
            >
              {result}
            </span>
          </>
        )}
      </div>

      {steps.length > 0 && (
        <div
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: '#f6f6f6',
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#666',
          }}
        >
          pipe({steps.map((k) => TRANSFORMS[k].label).join(', ')})({input}) ={' '}
          <strong>{result}</strong>
        </div>
      )}
    </div>
  )
}
```

## 参数

| 参数          | 类型         | 必填 | 默认值 | 说明             |
| ------------- | ------------ | ---- | ------ | ---------------- |
| `...handlers` | `Function[]` | 是   | —      | 要组合的函数列表 |

## 返回值

`(arg: any) => T` — 组合后的新函数。

## 示例

### 代码用法

```ts
import { pipe } from '@fexd/tools'

const add1 = (n) => n + 1
const mul2 = (n) => n * 2
const sub3 = (n) => n - 3

const calc = pipe(add1, mul2, sub3)

calc(5) // => (5 + 1) * 2 - 3 = 9

// 等同于
sub3(mul2(add1(5))) // => 9
```

## 注意

- 每个函数通过 `run()` 调用，因此也支持字符串路径等 `run` 可处理的值。
- 管道从左到右执行，与函数组合（从右到左）方向相反。

## 另见

- [`curry`](../async/curry) — 函数柯里化
- [`run`](../async/run) — 安全函数调用
