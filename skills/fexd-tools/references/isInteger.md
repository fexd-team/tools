# isInteger

判断值是否为整数（排除 NaN 和 Infinity）。

```ts
import { isInteger } from '@fexd/tools'
```

## 适用场景

- 判断值是否为整数（排除 NaN 和 Infinity）

## 不适用场景

- 需要允许 Infinity → 用 isNumber
- 需要判断有限数字 → 用 isFinite

## 签名

```ts
isInteger(value: any): value is number
```

## 用法

```ts
isInteger(0) // true
isInteger(1) // true
isInteger(-100) // true
isInteger(2e10) // true

isInteger(1.5) // false
isInteger(NaN) // false
isInteger(Infinity) // false
isInteger('1') // false (不做类型转换)
isInteger(null) // false
```

## 与相关函数对比

| 值         | `isNumber` | `isFinite` | `isInteger` |
| ---------- | ---------- | ---------- | ----------- |
| `42`       | true       | true       | true        |
| `1.5`      | true       | true       | false       |
| `Infinity` | true       | false      | false       |
| `NaN`      | false      | false      | false       |
| `'1'`      | false      | false      | false       |

## 相关函数

- `isNumber` — 判断值是否为数字（含 Infinity）
- `isFinite` — 判断值是否为有限数字
