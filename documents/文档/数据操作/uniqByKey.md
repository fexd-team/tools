# uniqByKey

按指定键对对象数组去重，只保留每个键值的首次出现。

## 类型签名

```ts
const uniqByKey = <T = any>(array?: any[], key?: any): T[]
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { uniqByKey } from '@fexd/tools'

const DATA = [
  { id: 1, name: 'Alice', dept: '工程' },
  { id: 2, name: 'Bob', dept: '设计' },
  { id: 3, name: 'Carol', dept: '工程' },
  { id: 1, name: 'Alice (重复)', dept: '产品' },
  { id: 4, name: 'Dave', dept: '设计' },
  { id: 2, name: 'Bob (重复)', dept: '工程' },
  { id: 5, name: 'Eve', dept: '工程' },
  { id: 3, name: 'Carol (重复)', dept: '设计' },
]

export default () => {
  const [key, setKey] = useState('id')
  const keys = ['id', 'name', 'dept']

  const result = uniqByKey(DATA, key)
  const resultSet = new Set(result)
  const removedCount = DATA.length - result.length

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
        <span style={{ fontSize: 13, color: '#999' }}>去重字段</span>
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              border: `2px solid ${k === key ? '#1890ff' : '#e8e8e8'}`,
              background: k === key ? '#e6f7ff' : '#fff',
              color: k === key ? '#1890ff' : '#666',
            }}
          >
            {k}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
          {DATA.length} →{' '}
          <strong style={{ color: '#52c41a' }}>{result.length}</strong> 项
          （去除 <strong style={{ color: '#ff4d4f' }}>{removedCount}</strong>{' '}
          个重复）
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            原始数组 ({DATA.length})
          </div>
          <pre
            style={{
              background: '#f9f9f9',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              color: '#555',
              marginBottom: 8,
            }}
          >
            {`uniqByKey(data, '${key}')  // ${DATA.length} → ${result.length} 项`}
          </pre>
          {DATA.map((item, i) => {
            const kept = resultSet.has(item)
            const seenBefore = !kept
            return (
              <div
                key={i}
                style={{
                  padding: '5px 10px',
                  marginBottom: 2,
                  borderRadius: 4,
                  background: seenBefore ? '#fff2f0' : '#fff',
                  border: `1px solid ${seenBefore ? '#ffa39e' : '#f0f0f0'}`,
                  opacity: seenBefore ? 0.5 : 1,
                  textDecoration: seenBefore ? 'line-through' : 'none',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  transition: 'all 0.3s',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: seenBefore ? '#ff4d4f' : '#52c41a',
                    fontWeight: 600,
                    minWidth: 14,
                  }}
                >
                  {seenBefore ? '✗' : '✓'}
                </span>
                {keys.map((k) => (
                  <span
                    key={k}
                    style={{
                      color: k === key ? '#1890ff' : '#666',
                      fontWeight: k === key ? 600 : 400,
                    }}
                  >
                    {k}: {JSON.stringify(item[k])}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

## 参数

| 参数    | 类型    | 必填 | 默认值 | 说明                 |
| ------- | ------- | ---- | ------ | -------------------- |
| `array` | `any[]` | 否   | `[]`   | 要去重的对象数组     |
| `key`   | `any`   | 否   | —      | 用于去重的对象属性名 |

## 返回值

`T[]` — 去重后的新数组。

## 示例

### 代码用法

```ts
import { uniqByKey } from '@fexd/tools'

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice2' },
]

uniqByKey(users, 'id')
// => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// 不含指定键的元素始终保留
const items = [{ a: 1 }, { b: 2 }, { a: 1 }]
uniqByKey(items, 'a')
// => [{ a: 1 }, { b: 2 }]
```

## 注意

- 不传 `key` 时，`key in item` 对任意元素均为 `false`，数组不会被去重。
- 不含指定键的元素始终保留，不参与去重判断。
- 相同键值保留首次出现的元素，后续重复项会被过滤。

## 另见

- [`difference`](./difference) — 数组差集
- [`intersection`](./intersection) — 数组交集
