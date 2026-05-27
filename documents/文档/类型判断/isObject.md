# isObject

判断值是否为纯对象（非 `null`、非数组、`typeof` 为 `'object'`）。

## 类型签名

```ts
isObject(value: any): boolean
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为纯对象时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isObject } from '@fexd/tools'

isObject({ a: 1 }) // => true
isObject({}) // => true
isObject([1, 2]) // => false（数组不是纯对象）
isObject(null) // => false
isObject(123) // => false
isObject('hello') // => false
```

## 注意

- 数组 **不是** 纯对象，`isObject([])` 返回 `false`。如需判断数组，请使用 `isArray`。

## 另见

- [`isArray`](./isArray) — 判断是否为数组
- [`isFunction`](./isFunction) — 判断是否为函数
- [`isExist`](./isExist) — 判断是否非 `null` 且非 `undefined`
