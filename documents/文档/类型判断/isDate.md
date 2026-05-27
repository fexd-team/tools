# isDate

判断值是否为 `Date` 对象。

## 类型签名

```ts
isDate(value: any): value is Date
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为 `Date` 实例时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `Date`。

## 示例

```ts
import { isDate } from '@fexd/tools'

isDate(new Date()) // => true
isDate('2024-01-01') // => false（字符串不是 Date 对象）
isDate(1700000000000) // => false（时间戳不是 Date 对象）
isDate(null) // => false
```

## 注意

- 基于 `instanceof Date`，`Invalid Date`（`new Date('invalid')`）仍返回 `true`；需额外用 `isNaN(date.getTime())` 校验有效性。
- 日期字符串、Unix 时间戳等 **不是** `Date` 对象，会返回 `false`。
- 跨 iframe 的 `Date` 实例可能因原型链不同而返回 `false`。

## 另见

- [`isExist`](./isExist) — 判断值是否非 `null` 且非 `undefined`
- [`isString`](./isString) — 判断是否为字符串（日期字符串需手动 `new Date()` 转换）
- [`isNumber`](./isNumber) — 判断是否为数字（时间戳需手动转换）
