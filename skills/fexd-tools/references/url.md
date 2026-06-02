# url

URL 查询参数解析与生成工具集。

```ts
import { url } from '@fexd/tools'
```

## 适用场景

- 从当前页面 URL 或指定 URL 中提取单个查询参数
- 批量解析 URL 中的所有查询参数为对象
- 根据参数对象生成带编码的查询字符串
- 需要自定义编解码逻辑时使用 `paramEscape` / `allParamEscape` 偏应用

## 不适用场景

- 需要解析完整 URL 结构（协议、域名、路径等），应使用浏览器原生 `URL` API
- 需要 URL rewrite 或路由跳转功能
- 需要 FormData 序列化，应使用 `qs` 或 `obj2formdata`

## 签名

```ts
function param(name: string, url?: string, decode?: (value: any) => any): any

function allParam(
  url?: string,
  decode?: (value: any) => any
): Record<string, any>

function generateParamStr(paramObj: Object, encode?: Function): string

const paramEscape: typeof param
const allParamEscape: typeof allParam
```

## 用法

```ts
import { url } from '@fexd/tools'

url.param('id', '?id=1&name=foo') // '1'
url.allParam('?a=1&b=2') // { a: '1', b: '2' }
url.generateParamStr({ q: '搜索' }) // '?q=%E6%90%9C%E7%B4%A2'

// 柯里化：固定 decode 为 unescape
url.paramEscape('key')
```

## 注意事项

- 默认 `url` 为 `globalThis.location.search`
- 解码依次尝试 `decodeURIComponent`、`decodeURI`、`unescape`
- `generateParamStr` 含前导 `?`；无值参数解析为空字符串
- `paramEscape` / `allParamEscape` 通过 `__` 偏应用固定解码器

## 相关函数

- `qs` — 基于 `url` 封装的 QueryString 序列化与反序列化
- `source` — 基于 `url` 的请求源标记工具
