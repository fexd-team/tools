# storage

`localStorage` 和 `sessionStorage` 的安全封装，支持 JSON 序列化和环境兼容。

## 类型签名

```ts
const storage: {
  get: (key: string) => any
  set: (key: string, value: any) => string
  remove: (key: string) => void
  getSession: (key: string) => any
  setSession: (key: string, value: any) => string
  removeSession: (key: string) => void
}
```

## 交互演示

```jsx
import React, { useState, useEffect } from 'react'
import { storage } from '@fexd/tools'

const DEMO_KEY = '__fexd_tools_demo__'

export default () => {
  const [input, setInput] = useState('')
  const [stored, setStored] = useState(null)

  useEffect(() => {
    setStored(storage.get(DEMO_KEY))
  }, [])

  const handleSave = () => {
    storage.set(DEMO_KEY, input)
    setStored(storage.get(DEMO_KEY))
  }

  const handleClear = () => {
    storage.remove(DEMO_KEY)
    setStored(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入内容存入 localStorage"
          style={{ padding: 4, flex: 1 }}
        />
        <button onClick={handleSave}>存储</button>
        <button onClick={handleClear}>清除</button>
      </div>
      <div style={{ fontSize: 14 }}>
        当前存储值:{' '}
        <code>{stored !== null ? JSON.stringify(stored) : '(空)'}</code>
      </div>
      <p style={{ color: '#999', fontSize: 12 }}>刷新页面后数据仍在</p>
    </div>
  )
}
```

## 对象属性

### localStorage 操作

| 方法                      | 说明                                 |
| ------------------------- | ------------------------------------ |
| `storage.get(key)`        | 读取并反序列化，失败则返回原始字符串 |
| `storage.set(key, value)` | 序列化后存储，返回存储的字符串       |
| `storage.remove(key)`     | 删除指定键                           |

### sessionStorage 操作

| 方法                             | 说明                         |
| -------------------------------- | ---------------------------- |
| `storage.getSession(key)`        | 从 sessionStorage 读取       |
| `storage.setSession(key, value)` | 写入 sessionStorage          |
| `storage.removeSession(key)`     | 删除 sessionStorage 中指定键 |

## 示例

### 代码用法

```ts
import { storage } from '@fexd/tools'

// localStorage
storage.set('user', { name: 'Alice', age: 25 })
storage.get('user') // => { name: 'Alice', age: 25 }
storage.remove('user')
storage.get('user') // => undefined

// sessionStorage
storage.setSession('token', 'abc123')
storage.getSession('token') // => 'abc123'
storage.removeSession('token')
```

## 注意

- 所有读写操作通过 `JSON.parse` / `safeStringify` 进行序列化，支持对象存储。
- 在 SSR 或 Storage 不可用的环境中，方法会变为无操作并输出警告日志。
- React 元素（含 `$$typeof` symbol）在序列化时会被跳过。
