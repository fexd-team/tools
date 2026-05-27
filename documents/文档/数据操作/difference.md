# difference

返回数组差集：`arr1` 中存在但 `arr2` 中不存在的元素。

## 类型签名

```ts
function difference(arr1: any[], arr2: any[]): any[]
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { difference, intersection } from '@fexd/tools'

const Dot = ({ val, type }) => {
  const palette = {
    a: '#e6f7ff',
    b: '#fff7e6',
    both: '#f6ffed',
    diff: '#f0f5ff',
  }
  const border = {
    a: '#91d5ff',
    b: '#ffd591',
    both: '#b7eb8f',
    diff: '#adc6ff',
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: palette[type],
        border: `2px solid ${border[type]}`,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'monospace',
      }}
    >
      {val}
    </span>
  )
}

export default () => {
  const [a, setA] = useState([1, 2, 3, 4, 5])
  const [b, setB] = useState([3, 4, 5, 6, 7])
  const [input, setInput] = useState('')
  const [target, setTarget] = useState('a')

  const add = () => {
    const val = input.trim()
    if (!val) return
    const num = isNaN(Number(val)) ? val : Number(val)
    if (target === 'a') setA((p) => [...p, num])
    else setB((p) => [...p, num])
    setInput('')
  }

  const remove = (arr, setArr, idx) =>
    setArr((p) => p.filter((_, i) => i !== idx))

  const onlyA = difference(a, b)
  const onlyB = difference(b, a)
  const common = intersection(a, b)

  const Row = ({ label, color, items, arr, setArr }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
        borderBottom: '1px solid #f5f5f5',
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          minWidth: 130,
          fontFamily: 'monospace',
          padding: '2px 8px',
          borderRadius: 4,
          background: color + '18',
        }}
      >
        {label}
      </span>
      {items.map((v, i) => (
        <span
          key={i}
          onClick={() => setArr && remove(arr, setArr, arr.indexOf(v))}
          style={{
            cursor: setArr ? 'pointer' : 'default',
          }}
        >
          <Dot
            val={v}
            type={
              setArr
                ? label === 'A'
                  ? 'a'
                  : 'b'
                : label === '交集'
                ? 'both'
                : 'diff'
            }
          />
        </span>
      ))}
      {items.length === 0 && (
        <span style={{ color: '#ccc', fontSize: 12 }}>空</span>
      )}
    </div>
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            fontSize: 13,
          }}
        >
          <option value="a">添加到 A</option>
          <option value="b">添加到 B</option>
        </select>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="输入值后回车"
          style={{
            padding: '4px 10px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            fontSize: 13,
            width: 120,
          }}
        />
        <button
          onClick={add}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid #1890ff',
            background: '#1890ff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          添加
        </button>
        <button
          onClick={() => {
            setA([1, 2, 3, 4, 5])
            setB([3, 4, 5, 6, 7])
          }}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            color: '#999',
          }}
        >
          🔄 重置
        </button>
      </div>

      <Row label="A" color="#1890ff" items={a} arr={a} setArr={setA} />
      <Row label="B" color="#fa8c16" items={b} arr={b} setArr={setB} />
      <Row label="difference(a, b)" color="#722ed1" items={onlyA} />
      <Row label="difference(b, a)" color="#eb2f96" items={onlyB} />
      <Row label="intersection(a, b)" color="#52c41a" items={common} />

      <pre
        style={{
          background: '#f9f9f9',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          color: '#555',
          margin: '12px 0 0',
        }}
      >
        {`const onlyA = difference(a, b)  // => [${onlyA.join(', ')}]
const onlyB = difference(b, a)  // => [${onlyB.join(', ')}]
const common = intersection(a, b) // => [${common.join(', ')}]`}
      </pre>

      <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
        💡 点击 A/B 行的圆圈可删除元素
      </p>
    </div>
  )
}
```

## 参数

| 参数   | 类型    | 必填 | 默认值 | 说明             |
| ------ | ------- | ---- | ------ | ---------------- |
| `arr1` | `any[]` | 是   | —      | 源数组           |
| `arr2` | `any[]` | 是   | —      | 要排除的元素数组 |

## 返回值

`any[]` — `arr1` 中存在但不在 `arr2` 中的元素组成的数组。

## 示例

```ts
import { difference } from '@fexd/tools'

difference([1, 2, 3, 4], [2, 4])
// => [1, 3]

difference(['a', 'b', 'c'], ['b'])
// => ['a', 'c']
```

## 注意

- 使用 `Array.includes()` 严格相等（`===`）比较元素。
- 保留 `arr1` 中的顺序与重复项，不做去重。
- 对象元素按引用比较，内容相同但引用不同视为不同元素。

## 另见

- [`intersection`](./intersection) — 数组交集
- [`diffArray`](./diffArray) — 数组差异计算（新增/删除）
