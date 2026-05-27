# isPlainObject

判断值是否为纯粹的普通对象（原型为 `Object.prototype` 或 `null`）。

## 类型签名

```ts
const isPlainObject = (value: any): boolean
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为纯粹的普通对象时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isPlainObject } from '@fexd/tools'

isPlainObject({ a: 1 }) // => true
isPlainObject(Object.create(null)) // => true
isPlainObject([1, 2]) // => false
isPlainObject(new Date()) // => false
isPlainObject(null) // => false
```

## 注意

- 与 `isObject` 不同，`isPlainObject` 更严格：排除了 `Date`、`RegExp`、React Element 等继承自 `Object` 但非纯对象的类型。
- `isObject` 判断 `typeof === 'object'` 且非数组、非 null；`isPlainObject` 还进一步检查原型链。

## 另见

- [`isObject`](./isObject) — 判断是否为对象（更宽松）
- [`isArray`](./isArray) — 判断是否为数组
