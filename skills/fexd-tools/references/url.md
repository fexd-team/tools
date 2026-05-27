# url

URL 查询参数解析与生成工具集。

```ts
import { url } from '@fexd/tools'
```

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
