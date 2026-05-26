# copy

将文本或 DOM 元素内容复制到剪贴板。
## 类型签名
```ts
const copy: (content: string | number | HTMLElement) => void | Promise<void>
```

## 交互演示
```jsx
import React, { useState } from 'react'
import { copy } from '@fexd/tools'

export default () => {
  const [copied, setCopied] = useState(false)
  const text = 'Hello from @fexd/tools! 🎉'

  const handleCopy = () => {
    copy(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <code style={{ padding: '4px 8px', background: '#f5f5f5', borderRadius: 4 }}>{text}</code>
        <button onClick={handleCopy} style={{ padding: '4px 12px' }}>
          {copied ? '✓ 已复制' : '复制'}
        </button>
      </div>
      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#555', marginTop: 12 }}>
{`copy('${text}')  // ${copied ? '→ 已写入剪贴板' : '点击按钮执行'}`}
      </pre>
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string \| number \| HTMLElement` | 是 | — | 要复制的内容。字符串/数字直接复制；DOM 元素复制其 HTML 和文本内容 |

## 返回值
`void | Promise<void>` — 复制 DOM 元素时返回 `Promise`；复制文本时无返回值。

## 示例
### 代码用法

```ts
import { copy } from '@fexd/tools'

// 复制文本
copy('hello world')

// 复制数字
copy(123)

// 复制 DOM 元素（同时复制 HTML 和纯文本）
copy(document.getElementById('content'))
```

## 注意
- 字符串/数字复制使用 `document.execCommand('copy')` 方式。
- DOM 元素复制使用 Clipboard API（`navigator.clipboard.write`），返回 Promise。
- 在 SSR 或不支持 Clipboard API 的环境中会输出警告。

## 另见
- [`file2base64`](./file2base64) — 文件转 Base64 Data URL
- [`run`](./run) — 安全调用函数或取值
