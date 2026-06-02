# qs

QueryString 序列化与反序列化，基于 `url` 模块封装。

```ts
import { qs } from '@fexd/tools'
```

## 适用场景

- 将查询字符串解析为对象，如解析 URL 参数
- 将对象序列化为查询字符串，用于拼接 API 请求 URL
- 与 `url` 模块配合处理带 `?` 前缀的完整 URL 参数

## 不适用场景

- 需要 FormData 格式序列化，应使用 `obj2formdata`
- 需要保留前导 `?` 的场景，应直接使用 `url.generateParamStr`
- 需要深度嵌套对象的序列化（仅支持扁平键值对）

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

## 相关函数

- `url` — 底层 URL 参数解析与生成，`qs` 基于其封装
- `safeStringify` — 安全 JSON 序列化，处理循环引用和 React 元素
