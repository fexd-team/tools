# flatten

将嵌套数组扁平化到指定深度。

## 类型签名

```ts
const flatten = <T = any>(array: any[], deep?: number): T[]
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { flatten } from '@fexd/tools'

const PRESETS = [
  { label: '3 层嵌套', data: [1, [2, [3, [4]]]], str: '[1, [2, [3, [4]]]]' },
  {
    label: '混合嵌套',
    data: ['a', ['b', 'c'], [['d'], 'e']],
    str: '["a", ["b","c"], [["d"],"e"]]',
  },
  { label: '深层', data: [[[[[1]]]]], str: '[[[[[1]]]]]' },
  { label: '扁平', data: [1, 2, 3, 4], str: '[1, 2, 3, 4]' },
]

const DEPTH_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96']

const renderNested = (arr, depth = 0) => (
  <span
    style={{
      display: 'inline-flex',
      gap: 2,
      alignItems: 'center',
      padding: '2px 4px',
      borderRadius: 4,
      background: DEPTH_COLORS[depth % DEPTH_COLORS.length] + '15',
      border: `1px solid ${DEPTH_COLORS[depth % DEPTH_COLORS.length]}44`,
    }}
  >
    <span
      style={{ fontSize: 10, color: DEPTH_COLORS[depth % DEPTH_COLORS.length] }}
    >
      [
    </span>
    {arr.map((item, i) => (
      <span key={i}>
        {i > 0 && <span style={{ color: '#ccc', margin: '0 1px' }}>,</span>}
        {Array.isArray(item) ? (
          renderNested(item, depth + 1)
        ) : (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 3,
              background: DEPTH_COLORS[depth % DEPTH_COLORS.length] + '20',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(item)}
          </span>
        )}
      </span>
    ))}
    <span
      style={{ fontSize: 10, color: DEPTH_COLORS[depth % DEPTH_COLORS.length] }}
    >
      ]
    </span>
  </span>
)

export default () => {
  const [data, setData] = useState(PRESETS[0].data)
  const [dataStr, setDataStr] = useState(PRESETS[0].str)
  const [deep, setDeep] = useState(999)

  const maxDepth = (() => {
    let d = 0
    const check = (a, lv) => {
      if (Array.isArray(a)) {
        d = Math.max(d, lv)
        a.forEach((i) => check(i, lv + 1))
      }
    }
    check(data, 0)
    return d
  })()

  const result = flatten(data, deep === 999 ? Infinity : deep)

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setData(p.data)
              setDataStr(p.str)
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

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 13, color: '#999' }}>展开深度</span>
        <input
          type="range"
          min={0}
          max={maxDepth + 1}
          value={deep > maxDepth ? maxDepth + 1 : deep}
          onChange={(e) =>
            setDeep(+e.target.value > maxDepth ? 999 : +e.target.value)
          }
          style={{ width: 150 }}
        />
        <code style={{ fontSize: 13, minWidth: 30 }}>
          {deep === 999 ? '∞' : deep}
        </code>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
          输入（嵌套结构）
        </div>
        <div
          style={{
            padding: '8px 12px',
            background: '#fafafa',
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
          {renderNested(data)}
        </div>
      </div>

      <div
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: '#ccc',
          margin: '8px 0',
        }}
      >
        ↓ flatten(data{deep !== 999 ? `, ${deep}` : ''}) ↓
      </div>

      <div
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          overflow: 'auto',
        }}
      >
        {renderNested(result)}
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
        {`flatten(${dataStr}${deep !== 999 ? `, ${deep}` : ''})
// => [${result.map((v) => JSON.stringify(v)).join(', ')}]`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数    | 类型     | 必填 | 默认值     | 说明                       |
| ------- | -------- | ---- | ---------- | -------------------------- |
| `array` | `any[]`  | 是   | —          | 要扁平化的数组             |
| `deep`  | `number` | 否   | `Infinity` | 扁平化深度，默认完全扁平化 |

## 返回值

`T[]` — 扁平化后的新数组。

## 示例

### 代码用法

```ts
import { flatten } from '@fexd/tools'

flatten([1, [2, [3, [4]]]]) // => [1, 2, 3, 4]（默认完全扁平化）
flatten([1, [2, [3, [4]]]], 1) // => [1, 2, [3, [4]]]（只展开一层）
flatten([1, [2, [3, [4]]]], 2) // => [1, 2, 3, [4]]（展开两层）
flatten([1, 2, 3]) // => [1, 2, 3]（无嵌套不变）
```

## 注意

- 只扁平化 `Array` 实例，类数组对象不会被展开。
- `deep = 0` 时返回原数组的浅拷贝。

## 另见

- [`first`](../data/first) — 获取数组第一个元素
- [`last`](../data/last) — 获取数组最后一个元素
