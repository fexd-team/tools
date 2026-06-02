# isNumber

判断值是否为有效数字（`number` 类型且非 NaN）。

```ts
import { isNumber } from '@fexd/tools'
```

## 适用场景

- 判断值是否为数字（排除 NaN，包括 Infinity）
- 类型守卫收窄

## 不适用场景

- 需要判断整数 → 用 isInteger
- 需要判断有限数字 → 用 isFinite
- 需要判断数字字符串 → 用 isNumberString

## 签名

```ts
isNumber(value: any): value is number
```

## 用法

```ts
isNumber(42) // true
isNumber(0) // true
isNumber(Infinity) // true
isNumber(-Infinity) // true

isNumber(NaN) // false
isNumber('42') // false
isNumber(null) // false
```

## 注意事项

- 排除 NaN；`Infinity` / `-Infinity` 仍为 true
- 字符串数字 `'42'` 为 false，需配合 `isNumberString` 或 `Number()`
- 与 `isFinite` 不同：不排除无穷大

## 相关函数

- `isInteger` — 判断值是否为整数
- `isFinite` — 判断值是否为有限数字
- `isNumberString` — 判断值是否为数字字符串
