# pick

从对象中选取指定的键，返回新对象。

## 类型签名

```ts
const pick = (obj: Record<string, any>, keys?: any[]): Record<string, any>
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { pick, pickBy, isNumber, isString } from '@fexd/tools'

const DATA = {
  id: 1,
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  role: 'admin',
  score: 98.5,
  active: true,
  bio: null,
}

const PREDICATES = {
  全部: () => true,
  '非空 (isExist)': (v) => v != null,
  '仅数字 (isNumber)': isNumber,
  '仅字符串 (isString)': isString,
  '值 > 10': (v) => typeof v === 'number' && v > 10,
  'key 长度 ≤ 4': (_v, k) => k.length <= 4,
}

export default () => {
  const [mode, setMode] = useState('pick')
  const [selected, setSelected] = useState(new Set(['id', 'name']))
  const [predicate, setPredicate] = useState('非空 (isExist)')

  const toggleKey = (key) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const result =
    mode === 'pick'
      ? pick(DATA, [...selected])
      : pickBy(DATA, PREDICATES[predicate])

  const keys = Object.keys(DATA)
  const resultKeys = new Set(Object.keys(result))

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['pick', 'pickBy'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '4px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              border: `2px solid ${m === mode ? '#1890ff' : '#e8e8e8'}`,
              background: m === mode ? '#e6f7ff' : '#fff',
              color: m === mode ? '#1890ff' : '#666',
              fontWeight: 600,
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'pick' ? (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => toggleKey(key)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                border: `1px solid ${
                  selected.has(key) ? '#1890ff' : '#d9d9d9'
                }`,
                background: selected.has(key) ? '#e6f7ff' : '#fff',
                color: selected.has(key) ? '#1890ff' : '#666',
              }}
            >
              {selected.has(key) ? '☑' : '☐'} {key}
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          {Object.keys(PREDICATES).map((p) => (
            <button
              key={p}
              onClick={() => setPredicate(p)}
              style={{
                padding: '3px 10px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                border: `1px solid ${p === predicate ? '#52c41a' : '#d9d9d9'}`,
                background: p === predicate ? '#f6ffed' : '#fff',
                color: p === predicate ? '#52c41a' : '#666',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            原始对象
          </div>
          {keys.map((key) => {
            const kept = resultKeys.has(key)
            return (
              <div
                key={key}
                style={{
                  padding: '4px 10px',
                  borderBottom: '1px solid #f5f5f5',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  opacity: kept ? 1 : 0.3,
                  transition: 'all 0.3s',
                  background: kept ? '#f6ffed' : 'transparent',
                }}
              >
                <span style={{ color: '#389e0d' }}>"{key}"</span>:{' '}
                <span style={{ color: '#1890ff' }}>
                  {JSON.stringify(DATA[key])}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>
          →
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            结果 ({Object.keys(result).length} 项)
          </div>
          <pre
            style={{
              padding: 10,
              borderRadius: 6,
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              fontSize: 12,
              fontFamily: 'monospace',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
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
        {mode === 'pick'
          ? `pick(obj, [${[...selected].map((k) => `'${k}'`).join(', ')}])`
          : `pickBy(obj, ${predicate})`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数   | 类型                  | 必填 | 默认值             | 说明             |
| ------ | --------------------- | ---- | ------------------ | ---------------- |
| `obj`  | `Record<string, any>` | 是   | —                  | 源对象           |
| `keys` | `any[]`               | 否   | `Object.keys(obj)` | 要选取的键名数组 |

## 返回值

`Record<string, any>` — 只包含指定键的新对象。

## 示例

### 代码用法

```ts
import { pick } from '@fexd/tools'

const user = { id: 1, name: 'Alice', age: 25, role: 'admin' }

pick(user, ['id', 'name'])
// => { id: 1, name: 'Alice' }

// 不传 keys 时返回浅拷贝
pick(user)
// => { id: 1, name: 'Alice', age: 25, role: 'admin' }
```

## 注意

- 始终返回新对象，不修改源对象。
- 仅浅拷贝选中键的值，嵌套对象仍是引用。
- `keys` 中不存在的键会被忽略。

## 另见

- [`pickBy`](./pickBy) — 按条件选取键
- [`get`](../data/get) — 按路径安全取值
