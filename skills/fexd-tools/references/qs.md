# qs

QueryString 序列化与反序列化，基于 `url` 模块封装。

```ts
import { qs } from '@fexd/tools'
```

## 签名

```ts
const parse: (str: string) => Record<string, any>
const stringify: (params?: Record<string, any>) => string

const qs: { parse: typeof parse; stringify: typeof stringify }
```

## 用法

```ts
import { qs } from '@fexd/tools'

qs.parse('?foo=1&bar=2') // { foo: '1', bar: '2' }
qs.parse('/path?foo=1') // 支持完整 URL

qs.stringify({ foo: 1, bar: 'a' }) // 'foo=1&bar=a'
// 不含前导 ?
```

## 注意事项

- `parse` 委托 `url.allParam`，自动解码
- `stringify` 委托 `url.generateParamStr` 并去掉前导 `?`
- 值为 `undefined` 时仍会 `encode` 进 query（与 `url` 行为一致）
