# isNumber

判断值是否为有效数字（排除 `NaN`）。

## 类型签名

```ts
isNumber(value: any): value is number
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为数字且不是 `NaN` 时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `number`。

## 示例

```ts
import { isNumber } from '@fexd/tools'

isNumber(123)     // => true
isNumber(0)       // => true
isNumber(-3.14)   // => true
isNumber(NaN)      // => false（NaN 被排除）
isNumber('123')    // => false
isNumber(null)     // => false
```

## 注意

- `NaN` 虽然是 `typeof` 为 `'number'` 的值，但 `isNumber(NaN)` 返回 `false`。如需判断 `NaN`，请使用 `isNaN`。

## 另见

- [`isNaN`](./isNaN) — 判断是否为 `NaN`
- [`isNumberString`](./isNumberString) — 判断是否为数字字符串
- [`isBigNumber`](./isBigNumber) — 判断是否超出安全整数范围的大数