# curry

将多参数函数转换为逐步接收参数的柯里化函数。

## 类型签名

```ts
const curry = <T>(fn: Function) => (...args: any[]): T
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { curry } from '@fexd/tools'

const FUNS = {
  'add(a,b,c)': {
    fn: (a, b, c) => a + b + c,
    params: ['a', 'b', 'c'],
    desc: '求和',
  },
  'mul(a,b,c)': {
    fn: (a, b, c) => a * b * c,
    params: ['a', 'b', 'c'],
    desc: '求积',
  },
  'format(greeting,name)': {
    fn: (g, n) => `${g}, ${n}!`,
    params: ['greeting', 'name'],
    desc: '拼接',
  },
  'clamp(min,max,val)': {
    fn: (min, max, val) => Math.min(Math.max(val, min), max),
    params: ['min', 'max', 'val'],
    desc: '限界',
  },
}

export default () => {
  const [selected, setSelected] = useState('add(a,b,c)')
  const { fn, params, desc } = FUNS[selected]
  const curried = curry(fn)

  const [args, setArgs] = useState(Array(params.length).fill(''))
  const [steps, setSteps] = useState([])

  const setArg = (i, v) => {
    const next = [...args]
    next[i] = v
    setArgs(next)

    const filled = next.slice(0, i + 1).filter((a) => a !== '')
    const callSteps = []
    let partial = curried
    const batch = []
    for (let j = 0; j <= i; j++) {
      if (next[j] !== '') {
        batch.push(next[j])
        const parsed = isNaN(Number(next[j])) ? next[j] : Number(next[j])
        partial = partial(parsed)
        const isComplete = typeof partial !== 'function'
        callSteps.push({
          applied: [...batch],
          remaining: params.slice(j + 1),
          result: isComplete ? partial : '→ ƒ',
          complete: isComplete,
        })
      }
    }
    setSteps(callSteps)
  }

  const reset = () => {
    setArgs(Array(params.length).fill(''))
    setSteps([])
  }

  const switchFn = (key) => {
    setSelected(key)
    const p = FUNS[key].params
    setArgs(Array(p.length).fill(''))
    setSteps([])
  }

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}
      >
        {Object.keys(FUNS).map((key) => (
          <button
            key={key}
            onClick={() => switchFn(key)}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              border: `2px solid ${key === selected ? '#1890ff' : '#e8e8e8'}`,
              background: key === selected ? '#e6f7ff' : '#fff',
              color: key === selected ? '#1890ff' : '#666',
            }}
          >
            {FUNS[key].desc}: {key}
          </button>
        ))}
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
        <span style={{ fontSize: 14, fontFamily: 'monospace', color: '#666' }}>
          curry(fn)
        </span>
        <span style={{ color: '#ccc' }}>(</span>
        {params.map((p, i) => (
          <React.Fragment key={p}>
            {i > 0 && <span style={{ color: '#ccc' }}>,</span>}
            <div style={{ position: 'relative' }}>
              <input
                value={args[i]}
                onChange={(e) => setArg(i, e.target.value)}
                placeholder={p}
                style={{
                  width: 60,
                  padding: '6px 8px',
                  borderRadius: 6,
                  textAlign: 'center',
                  border: `2px solid ${args[i] ? '#1890ff' : '#e8e8e8'}`,
                  fontSize: 14,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  background: args[i] ? '#e6f7ff' : '#fff',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  color: '#999',
                  whiteSpace: 'nowrap',
                }}
              >
                {p}
              </span>
            </div>
          </React.Fragment>
        ))}
        <span style={{ color: '#ccc' }}>)</span>
        <button
          onClick={reset}
          style={{
            padding: '4px 10px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            color: '#999',
          }}
        >
          🔄
        </button>
      </div>

      {steps.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            marginTop: 8,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: '4px 0',
                fontSize: 13,
                fontFamily: 'monospace',
                color: step.complete ? '#389e0d' : '#666',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#999', fontSize: 11 }}>#{i + 1}</span>
              <span>fn({step.applied.join(', ')})</span>
              <span style={{ color: '#ccc' }}>→</span>
              <span
                style={{
                  fontWeight: step.complete ? 700 : 400,
                  color: step.complete ? '#389e0d' : '#999',
                }}
              >
                {step.complete ? (
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 4,
                      background: '#f6ffed',
                      border: '1px solid #b7eb8f',
                    }}
                  >
                    ✅ {String(step.result)}
                  </span>
                ) : (
                  <span>ƒ (还需 {step.remaining.join(', ')})</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## 参数

| 参数 | 类型       | 必填 | 默认值 | 说明           |
| ---- | ---------- | ---- | ------ | -------------- |
| `fn` | `Function` | 是   | —      | 要柯里化的函数 |

## 返回值

`(...args: any[]) => T` — 柯里化后的函数。参数不足时返回新的偏函数，参数齐全时调用原函数。

## 示例

### 代码用法

```ts
import { curry } from '@fexd/tools'

const add = curry((a, b, c) => a + b + c)

add(1)(2)(3) // => 6
add(1, 2)(3) // => 6
add(1)(2, 3) // => 6
add(1, 2, 3) // => 6
```

## 注意

- 依赖 `fn.length` 判断参数数量，仅对有声明参数的函数有效。
- 通过 `fn.bind(this, ...args)` 实现偏应用，会保留 `this` 上下文。

## 另见

- [`__`](./下划线) — 带占位符的偏应用
- [`pipe`](../async/pipe) — 管道组合
