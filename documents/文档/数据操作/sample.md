# sample

从数组中随机取一个元素。

## 类型签名

```ts
const sample = <T = any>(array: any[]): T
```

## 交互演示

```jsx
import React, { useState, useCallback } from 'react'
import { sample } from '@fexd/tools'

const FRUIT = [
  '🍎 苹果',
  '🍌 香蕉',
  '🍇 葡萄',
  '🍊 橘子',
  '🍓 草莓',
  '🥝 猕猴桃',
  '🍑 桃子',
  '🍒 樱桃',
]
const COLORS = [
  '#ff4d4f',
  '#fadb14',
  '#722ed1',
  '#fa8c16',
  '#eb2f96',
  '#52c41a',
  '#fa541c',
  '#cf1322',
]
const NAMES = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank']

export default () => {
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [source, setSource] = useState('fruit')

  const items = source === 'fruit' ? FRUIT : source === 'color' ? COLORS : NAMES

  const pick = useCallback(() => {
    const picked = sample(items)
    setResult(picked)
    setHistory((prev) =>
      [{ value: picked, time: new Date().toLocaleTimeString() }, ...prev].slice(
        0,
        12
      )
    )
  }, [items])

  const pickMultiple = useCallback(() => {
    const picks = Array.from({ length: 5 }, () => sample(items))
    setResult(picks.join(', '))
    picks.forEach((p) => {
      setHistory((prev) =>
        [{ value: p, time: new Date().toLocaleTimeString() }, ...prev].slice(
          0,
          12
        )
      )
    })
  }, [items])

  const btnStyle = {
    padding: '6px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    border: '1px solid #d9d9d9',
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 12, color: '#999' }}>数据源</span>
        {[
          { key: 'fruit', label: '水果' },
          { key: 'color', label: '颜色' },
          { key: 'name', label: '名字' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setSource(s.key)
              setResult(null)
            }}
            style={{
              ...btnStyle,
              border: `2px solid ${s.key === source ? '#1890ff' : '#e8e8e8'}`,
              background: s.key === source ? '#e6f7ff' : '#fff',
              color: s.key === source ? '#1890ff' : '#666',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              background: source === 'color' ? item : '#f5f5f5',
              color: source === 'color' ? '#fff' : '#666',
              border: '1px solid #e8e8e8',
            }}
          >
            {source === 'color' ? item : item}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={pick}
          style={{
            ...btnStyle,
            background: '#1890ff',
            color: '#fff',
            border: '1px solid #1890ff',
          }}
        >
          🎲 sample() 取一个
        </button>
        <button
          onClick={pickMultiple}
          style={{
            ...btnStyle,
            background: '#722ed1',
            color: '#fff',
            border: '1px solid #722ed1',
          }}
        >
          🎯 连续取 5 次
        </button>
      </div>

      {result && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            marginBottom: 12,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {result}
        </div>
      )}

      <pre
        style={{
          background: '#f9f9f9',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          color: '#555',
          marginBottom: 12,
        }}
      >
        {`sample([${items
          .slice(0, 4)
          .map((i) => `'${i}'`)
          .join(', ')}, ...])${
          result
            ? `\n// => '${
                typeof result === 'string' && result.includes(',')
                  ? result.split(', ')[0]
                  : result
              }'`
            : ''
        }`}
      </pre>

      {history.length > 0 && (
        <div
          style={{
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            maxHeight: 160,
            overflowY: 'auto',
            background: '#fafafa',
          }}
        >
          {history.map((h, i) => (
            <div
              key={i}
              style={{
                padding: '3px 12px',
                borderBottom: '1px solid #f5f5f5',
                fontSize: 12,
                display: 'flex',
                gap: 8,
                color: i === 0 ? '#333' : '#999',
              }}
            >
              <span style={{ color: '#bbb' }}>{h.time}</span>
              <span style={{ fontFamily: 'monospace' }}>
                sample(arr) → {h.value}
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

| 参数    | 类型    | 必填 | 默认值 | 说明   |
| ------- | ------- | ---- | ------ | ------ |
| `array` | `any[]` | 是   | —      | 源数组 |

## 返回值

`T` — 随机选中的元素。空数组返回 `undefined`。

## 示例

```ts
import { sample } from '@fexd/tools'

sample([1, 2, 3, 4]) // => 随机返回其中一个元素
sample(['a', 'b', 'c']) // => 'a' 或 'b' 或 'c'
sample([]) // => undefined
```

## 注意

- 空数组返回 `undefined`。
- 每次调用独立随机，不保证均匀分布。
- 不修改源数组。

## 另见

- [`random`](./random) — 随机数生成
- [`uniqByKey`](../data/uniqByKey) — 按键去重
