# isNaN

判断值是否为 `NaN`。

## 类型签名

```ts
isNaN(value: any): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为 `NaN` 时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isNaN } from '@fexd/tools'

isNaN(NaN)       // => true
isNaN(0 / 0)     // => true
isNaN(123)       // => false
isNaN('hello')   // => false（字符串不是 NaN）
isNaN(undefined) // => false
```

## 注意

- 使用 `value !== value` 实现，这是检测 `NaN` 的最可靠方式（因为 `NaN` 是 JS 中唯一不等于自身的值）。
- 此函数 **不会** 对非数字值返回 `true`，与全局 `isNaN()` 的行为不同。

## 另见

- [`isNumber`](./isNumber) — 判断是否为有效数字（`isNumber(NaN)` 返回 `false`）