# qs

QueryString 的简易解析与序列化工具。

## 类型签名

```ts
const qs: {
  parse: (str: string) => Record<string, any>
  stringify: (params?: Record<string, any>) => string
}
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { qs } from '@fexd/tools'

export default () => {
  const [queryStr, setQueryStr] = useState('id=1&name=Alice&role=admin')
  const parsed = qs.parse(queryStr)

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
          输入查询字符串:
        </div>
        <input
          value={queryStr}
          onChange={(e) => setQueryStr(e.target.value)}
          style={{ padding: 4, width: '100%', fontFamily: 'monospace' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            qs.parse 结果:
          </div>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 8,
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            qs.stringify 还原:
          </div>
          <code
            style={{
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {qs.stringify(parsed)}
          </code>
        </div>
      </div>
    </div>
  )
}
```

## 对象属性

| 方法                   | 说明                                 |
| ---------------------- | ------------------------------------ |
| `qs.parse(str)`        | 将查询字符串解析为对象               |
| `qs.stringify(params)` | 将对象序列化为查询字符串（不含 `?`） |

## 示例

### 代码用法

```ts
import { qs } from '@fexd/tools'

// 解析查询字符串
qs.parse('id=1&name=Alice')
// => { id: '1', name: 'Alice' }

// 序列化为查询字符串
qs.stringify({ id: 1, name: 'Alice' })
// => 'id=1&name=Alice'

// 注意：stringify 的结果不含 ?
```

## 注意

- `qs.stringify` 的返回值 **不含** 前缀 `?`，与 `url.generateParamStr`（含 `?`）不同。
- `qs.parse` 的功能与 `url.allParam` 相同。

## 另见

- [`url`](../format/url) — URL 参数提取与生成
