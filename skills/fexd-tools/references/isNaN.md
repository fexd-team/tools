# isNaN

判断值是否为 NaN，利用 `NaN !== NaN` 特性。

```ts
import { isNaN } from '@fexd/tools'
```

## 签名

```ts
isNaN(value: any): value is typeof NaN
```

## 用法

```ts
isNaN(NaN) // true
isNaN(0 / 0) // true
isNaN(Number('foo')) // true

isNaN(42) // false
isNaN('NaN') // false
isNaN(Infinity) // false
```

## 注意事项

- `value !== value`，不依赖 `Number.isNaN`
- 字符串 `'NaN'` 为 false（非 number 类型的 NaN）
- `isNumber` 用本函数排除 NaN
