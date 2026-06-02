# compactObject

过滤对象中的空值（`null`、`undefined`、空字符串），返回新对象。

```ts
import { compactObject } from '@fexd/tools'
```

## 适用场景

- 移除对象中的 null、undefined 和空字符串
- 清理 API 请求参数，移除无效值
- 简单的空值过滤，不需要复杂条件

## 不适用场景

- 需要自定义过滤条件 → 用 `pickBy`
- 需要只移除 null/undefined 但保留空字符串 → 用 `pickBy(obj)`
- 需要递归深度过滤嵌套对象 → 需自行递归或用 `deepMapItem`

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

## 相关函数

- `pickBy` — 按条件选取属性，支持自定义过滤函数
- `pick` — 按键名选取属性
- `isExist` — compactObject 内部使用 isExist 判断空值
