# diffArray

比较两个数组，返回新增、删除和合并差异。

## 类型签名

```ts
function diffArray<T = any>(
  init: T[],
  current: T[]
): {
  add: T[]
  remove: T[]
  diff: T[]
}
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { diffArray } from '@fexd/tools'

const Tag = ({ val, type }) => {
  const colors = {
    kept: { bg: '#fafafa', fg: '#999', border: '#e8e8e8' },
    add: { bg: '#f6ffed', fg: '#389e0d', border: '#b7eb8f' },
    remove: { bg: '#fff2f0', fg: '#cf1322', border: '#ffa39e' },
  }
  const c = colors[type] || colors.kept
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 4,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontSize: 13,
        fontFamily: 'monospace',
        margin: 2,
      }}
    >
      {type === 'add' && '+ '}
      {type === 'remove' && '− '}
      {JSON.stringify(val)}
    </span>
  )
}

const PRESETS = [
  { label: '📦 基本数字', init: '[1, 2, 3, 4, 5]', current: '[2, 4, 5, 6, 7]' },
  {
    label: '🔤 字符串',
    init: '["apple", "banana", "cherry"]',
    current: '["banana", "date", "elderberry"]',
  },
  { label: '🔀 完全不同', init: '[1, 2, 3]', current: '[4, 5, 6]' },
  { label: '✅ 完全相同', init: '["a", "b"]', current: '["a", "b"]' },
]

export default () => {
  const [initStr, setInitStr] = useState('[1, 2, 3, 4, 5]')
  const [curStr, setCurStr] = useState('[2, 4, 5, 6, 7]')

  let initArr, curArr, result, error
  try {
    initArr = JSON.parse(initStr)
    curArr = JSON.parse(curStr)
    result = diffArray(initArr, curArr)
  } catch (e) {
    error = e.message
  }

  const kept = result ? initArr.filter((v) => curArr.includes(v)) : []

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setInitStr(p.init)
              setCurStr(p.current)
            }}
            style={{
              padding: '3px 10px',
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            初始数组 (init)
          </div>
          <input
            value={initStr}
            onChange={(e) => setInitStr(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #d9d9d9',
              fontSize: 13,
              fontFamily: 'monospace',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            当前数组 (current)
          </div>
          <input
            value={curStr}
            onChange={(e) => setCurStr(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #d9d9d9',
              fontSize: 13,
              fontFamily: 'monospace',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {error ? (
        <div style={{ color: '#ff4d4f', fontSize: 13, padding: 8 }}>
          ❌ JSON 解析失败: {error}
        </div>
      ) : (
        result && (
          <div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 12,
                padding: '10px 12px',
                background: '#fafafa',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 13 }}>
                🟢 新增{' '}
                <strong style={{ color: '#389e0d' }}>
                  {result.add.length}
                </strong>
              </span>
              <span style={{ fontSize: 13 }}>
                🔴 删除{' '}
                <strong style={{ color: '#cf1322' }}>
                  {result.remove.length}
                </strong>
              </span>
              <span style={{ fontSize: 13 }}>
                ⚪ 保留 <strong>{kept.length}</strong>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                marginBottom: 8,
              }}
            >
              {kept.map((v, i) => (
                <Tag key={`k-${i}`} val={v} type="kept" />
              ))}
              {result.add.map((v, i) => (
                <Tag key={`a-${i}`} val={v} type="add" />
              ))}
              {result.remove.map((v, i) => (
                <Tag key={`r-${i}`} val={v} type="remove" />
              ))}
            </div>

            <pre
              style={{
                background: '#f9f9f9',
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 12,
                color: '#555',
              }}
            >
              {`diffArray(${initStr}, ${curStr})
// => { add: ${JSON.stringify(result.add)}, remove: ${JSON.stringify(
                result.remove
              )}, diff: ${JSON.stringify(result.diff)} }`}
            </pre>
          </div>
        )
      )}
    </div>
  )
}
```

## 参数

| 参数      | 类型  | 必填 | 默认值 | 说明     |
| --------- | ----- | ---- | ------ | -------- |
| `init`    | `T[]` | 是   | —      | 初始数组 |
| `current` | `T[]` | 是   | —      | 当前数组 |

## 返回值

`{ add, remove, diff }` — 差异结果对象。

| 字段     | 说明                                       |
| -------- | ------------------------------------------ |
| `add`    | `current` 中新增的元素（不在 `init` 中）   |
| `remove` | `init` 中被删除的元素（不在 `current` 中） |
| `diff`   | 所有变更元素（`add` + `remove` 的并集）    |

## 示例

### 代码用法

```ts
import { diffArray } from '@fexd/tools'

diffArray([1, 2, 3], [2, 3, 4])
// => { add: [4], remove: [1], diff: [4, 1] }

diffArray(['a', 'b'], ['b', 'c'])
// => { add: ['c'], remove: ['a'], diff: ['c', 'a'] }
```

## 注意

- 使用 `Array.includes()` 严格相等（`===`）比较元素。
- `diff` 为 `add` 与 `remove` 的并集，不含顺序保证。
- 对象元素按引用比较，内容相同但引用不同视为不同元素。

## 另见

- [`difference`](./difference) — 数组差集
- [`intersection`](./intersection) — 数组交集
