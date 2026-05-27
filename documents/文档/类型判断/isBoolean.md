# isBoolean

判断值是否为布尔值。

## 类型签名

```ts
isBoolean(value: any): value is boolean
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为 `true` 或 `false` 时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `boolean`。

## 示例

```ts
import { isBoolean } from '@fexd/tools'

isBoolean(true) // => true
isBoolean(false) // => true
isBoolean(0) // => false
isBoolean(null) // => false
isBoolean('true') // => false
```

## 注意

- 基于 `typeof value === 'boolean'`，只认原始布尔值 `true` / `false`。
- 字符串 `'true'`、`'false'` 以及 `Boolean` 包装对象（`new Boolean(true)`）均返回 `false`。
- 与 `!!value` 不同：falsy 值（`0`、`''`）不会被当作布尔值。

## 另见

- [`isExist`](./isExist) — 判断值是否非 `null` 且非 `undefined`
- [`isString`](./isString) — 判断是否为字符串
- [`isNumber`](./isNumber) — 判断是否为有效数字
