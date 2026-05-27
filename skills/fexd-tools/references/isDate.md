# isDate

判断值是否为 Date 实例，支持跨 realm 检测。

```ts
import { isDate } from '@fexd/tools'
```

## 签名

```ts
isDate(value: any): value is Date
```

## 用法

```ts
isDate(new Date()) // true
isDate(new Date('2024-01-01')) // true

isDate('2024-01-01') // false
isDate(1704067200000) // false
isDate(null) // false
```

## 注意事项

- 先 `instanceof Date`，再 `[object Date]` toString 兜底
- 跨 iframe/realm 中不同全局的 Date 仍可能被识别
- 无效日期如 `new Date('invalid')` 仍为 true（实例存在即可）
