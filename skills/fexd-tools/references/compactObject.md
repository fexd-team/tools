# compactObject

过滤对象中的空值（`null`、`undefined`、空字符串），返回新对象。

```ts
import { compactObject } from '@fexd/tools'
```

## 签名

```ts
const compactObject = (obj: Record<string, any>): Record<string, any>
```

## 用法

```ts
compactObject({ a: 1, b: null, c: undefined, d: '', e: 0 })
// => { a: 1, e: 0 }

compactObject({ name: 'foo', desc: '' })
// => { name: 'foo' }

compactObject(null as any) // => {}
```

## 注意事项

- 使用 `isExist` 判断，仅排除 `null` 与 `undefined`，`0`、`false` 会保留
- 空字符串 `''` 单独排除
- 入参为假值时返回 `{}`，不修改原对象
