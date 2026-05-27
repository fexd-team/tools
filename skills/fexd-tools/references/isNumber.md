# isNumber

判断值是否为有效数字（`number` 类型且非 NaN）。

```ts
import { isNumber } from '@fexd/tools'
```

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
