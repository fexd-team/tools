# isUndefined

判断值是否为 `undefined`。

## 类型签名

```ts
isUndefined(value: any): value is undefined
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值严格等于 `undefined` 时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `undefined`。

## 示例

```ts
import { isUndefined } from '@fexd/tools'

isUndefined(undefined) // => true
isUndefined(null) // => false
isUndefined(0) // => false
isUndefined('') // => false
```

## 注意

- 基于 `typeof value === 'undefined'`，只匹配严格意义上的 `undefined`。
- `null` 返回 `false`；`== null` 会同时匹配两者，语义不同。
- 未声明的变量在访问时会抛错，无法作为参数传入；本函数用于已获取到的值。

## 另见

- [`isNull`](./isNull) — 判断是否为 `null`
- [`isExist`](./isExist) — 判断是否非 `null` 且非 `undefined`
