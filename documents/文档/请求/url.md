# url

URL 参数处理的工具集合，支持参数解析、提取和生成。

## 类型签名

```ts
const url: {
  param: (name: string, url?: string, decode?: Function) => any
  paramEscape: typeof param
  allParam: (url?: string, decode?: Function) => Record<string, any>
  allParamEscape: typeof allParam
  generateParamStr: (paramObj: Object, encode?: Function) => string
}
```

## 对象属性

| 方法 | 说明 |
|------|------|
| `url.param(name, url?, decode?)` | 从 URL 提取单个参数值 |
| `url.paramEscape(name, url?)` | 同 `param`，但使用 `unescape` 解码 |
| `url.allParam(url?, decode?)` | 从 URL 提取所有参数为对象 |
| `url.allParamEscape(url?)` | 同 `allParam`，但使用 `unescape` 解码 |
| `url.generateParamStr(paramObj?, encode?)` | 将对象生成以 `?` 开头的查询字符串 |

## 示例

```ts
import { url } from '@fexd/tools'

// 提取单个参数
url.param('name', 'http://example.com?id=1&name=Alice')
// => 'Alice'

// 提取所有参数
url.allParam('http://example.com?id=1&name=Alice')
// => { id: '1', name: 'Alice' }

// 处理包含 = 的值（如 Base64、JWT）
url.allParam('http://example.com?token=abc==')
// => { token: 'abc==' }

// 生成查询字符串
url.generateParamStr({ id: 1, name: 'Alice' })
// => '?id=1&name=Alice'
```

## 注意

- `param` 和 `allParam` 默认使用当前页面的 `location.search`，可传入自定义 URL 字符串。
- `paramEscape` 和 `allParamEscape` 使用已废弃的 `unescape`，不推荐在新代码中使用。
- `generateParamStr` 的返回值以 `?` 开头，与 `qs.stringify`（不含 `?`）不同。

## 另见

- [`qs`](../序列化/qs) — QueryString 解析/序列化
- [`source`](./source) — 在线资源加载