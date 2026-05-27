# get

按路径从对象中安全取值，支持默认值。

## 类型签名

```ts
type KType = string | any[] | number

function get<T = any>(obj: any, keys?: KType, defaultValue?: any): T
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { get, set } from '@fexd/tools'

const INITIAL = {
  user: {
    name: 'Alice',
    profile: { age: 25, hobbies: ['coding', 'reading', 'hiking'] },
    settings: { theme: 'dark', lang: 'zh-CN' },
  },
  meta: { version: '1.0', tags: ['stable', 'release'] },
}

const PRESETS = [
  'user.name',
  'user.profile.age',
  'user.profile.hobbies.0',
  'user.settings.theme',
  'meta.tags',
  'user.nonexist',
]

export default () => {
  const [obj, setObj] = useState(INITIAL)
  const [path, setPath] = useState('user.profile.age')
  const [defaultVal, setDefaultVal] = useState("'fallback'")
  const [setPath2, setSetPath2] = useState('user.settings.theme')
  const [setValue, setSetValue] = useState("'light'")
  const [mode, setMode] = useState('get')

  const parsed = (() => {
    try {
      return eval(`(${defaultVal})`)
    } catch {
      return undefined
    }
  })()
  const result = get(obj, path, parsed)

  const doSet = () => {
    try {
      const val = eval(`(${setValue})`)
      const newObj = set(JSON.parse(JSON.stringify(obj)), setPath2, val)
      setObj(newObj)
    } catch {}
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['get', 'set'].map((m) => (
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
        <button
          onClick={() => setObj(INITIAL)}
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
          🔄 重置数据
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            📦 数据对象
          </div>
          <pre
            style={{
              padding: 10,
              borderRadius: 6,
              background: '#fafafa',
              border: '1px solid #e8e8e8',
              fontSize: 11,
              fontFamily: 'monospace',
              margin: 0,
              maxHeight: 200,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {mode === 'get' ? (
            <>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                🔍 get 取值
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>
                  路径
                </div>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
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
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                  marginBottom: 8,
                }}
              >
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPath(p)}
                    style={{
                      padding: '1px 6px',
                      borderRadius: 3,
                      fontSize: 11,
                      cursor: 'pointer',
                      border: '1px solid #e8e8e8',
                      background: p === path ? '#e6f7ff' : '#fff',
                      fontFamily: 'monospace',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>
                  defaultValue
                </div>
                <input
                  value={defaultVal}
                  onChange={(e) => setDefaultVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid #d9d9d9',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  background: result !== undefined ? '#f6ffed' : '#fff7e6',
                  border: `1px solid ${
                    result !== undefined ? '#b7eb8f' : '#ffe58f'
                  }`,
                }}
              >
                <div style={{ fontSize: 11, color: '#999' }}>结果</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: result !== undefined ? '#389e0d' : '#fa8c16',
                  }}
                >
                  {JSON.stringify(result)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                ✏️ set 设值
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>
                  路径
                </div>
                <input
                  value={setPath2}
                  onChange={(e) => setSetPath2(e.target.value)}
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
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>
                  值
                </div>
                <input
                  value={setValue}
                  onChange={(e) => setSetValue(e.target.value)}
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
              <button
                onClick={doSet}
                style={{
                  padding: '6px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#52c41a',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                ✅ 应用 set
              </button>
            </>
          )}
        </div>
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
        {mode === 'get'
          ? `get(obj, '${path}'${
              defaultVal !== "'fallback'" && defaultVal ? `, ${defaultVal}` : ''
            })  // => ${JSON.stringify(result)}`
          : `set(obj, '${setPath2}', ${setValue})`}
      </pre>
    </div>
  )
}
```

## 参数

| 参数           | 类型    | 必填 | 默认值      | 说明                                                                 |
| -------------- | ------- | ---- | ----------- | -------------------------------------------------------------------- |
| `obj`          | `any`   | 是   | —           | 源对象                                                               |
| `keys`         | `KType` | 否   | `[]`        | 属性路径，支持点号字符串（`'a.b.c'`）、数组（`['a','b','c']`）或数字 |
| `defaultValue` | `any`   | 否   | `undefined` | 路径不存在时的默认返回值                                             |

## 返回值

`T` — 路径对应的值；若路径不存在或访问出错，返回 `defaultValue`。

## 示例

### 代码用法

```ts
import { get } from '@fexd/tools'

const obj = { a: { b: { c: 'hello' } } }

get(obj, 'a.b.c') // => 'hello'
get(obj, 'a.b.d', 'default') // => 'default'（路径不存在，返回默认值）
get(obj, ['a', 'b', 'c']) // => 'hello'
get(obj, 'a.b') // => { c: 'hello' }
get(null, 'a.b') // => undefined（安全访问，不报错）
```

## 注意

- 路径访问过程被 `try/catch` 包裹，即使中间路径为 `null` 或 `undefined` 也不会抛错，而是返回 `defaultValue`。
- 数字类型的 `keys` 会被转为字符串（`get(arr, 0)` 等同于 `get(arr, '0')`）。

## 另见

- [`set`](./set) — 按路径安全设值
- [`pick`](../data/pick) — 从对象中选取指定键
- [`pickBy`](../data/pickBy) — 按条件选取键
