# isInteger

判断值是否为整数（排除 NaN、Infinity）。

## 类型签名

```ts
isInteger(value: any): value is number
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为整数时返回 `true`。具有 TypeScript 类型守卫。

## 示例

```ts
import { isInteger } from '@fexd/tools'

isInteger(0) // => true
isInteger(1) // => true
isInteger(-100) // => true
isInteger(2e10) // => true

isInteger(1.5) // => false
isInteger(NaN) // => false
isInteger(Infinity) // => false
isInteger('1') // => false
isInteger(null) // => false
```

## 注意

- 等价于 `typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value`。
- `Infinity` 和 `-Infinity` 返回 `false`（它们不是整数）。
- 不做类型转换，字符串 `'1'` 返回 `false`。
- 与 `isNumber` 的区别：`isNumber` 允许小数和 Infinity，`isInteger` 只接受整数。

## 另见

- [`isNumber`](./isNumber) — 判断是否为 number 类型（包括小数，排除 NaN）
- [`isFinite`](./isFinite) — 判断是否为有限数字
