# classnames

CSS 类名拼接工具，原样导出 [classnames](https://github.com/JedWatney/classnames) 包。

## 类型签名

```ts
// 详见 classnames 包的类型定义
import classnames from 'classnames'
export { default as classnames } from 'classnames'
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { classnames } from '@fexd/tools'

export default () => {
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  const cls = classnames({
    bold,
    italic,
    underline,
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={bold}
            onChange={() => setBold(!bold)}
          />{' '}
          bold
        </label>
        <label>
          <input
            type="checkbox"
            checked={italic}
            onChange={() => setItalic(!italic)}
          />{' '}
          italic
        </label>
        <label>
          <input
            type="checkbox"
            checked={underline}
            onChange={() => setUnderline(!underline)}
          />{' '}
          underline
        </label>
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
        {`classnames({ bold: ${bold}, italic: ${italic}, underline: ${underline} })
// => '${cls}'`}
      </pre>
      <div
        style={{
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecoration: underline ? 'underline' : 'none',
          fontSize: 18,
        }}
      >
        Hello @fexd/tools
      </div>
    </div>
  )
}
```

## 示例

### 代码用法

```ts
import { classnames } from '@fexd/tools'

classnames('foo', 'bar') // => 'foo bar'
classnames('foo', { bar: true }) // => 'foo bar'
classnames({ foo: true, bar: false }) // => 'foo'
classnames(['foo', 'bar']) // => 'foo bar'
```

## 注意

- 这是 [classnames](https://github.com/JedWatney/classnames) 包的原样导出，用法完全一致。
- 在 @fexd/tools 内部提供，避免项目额外安装依赖。
