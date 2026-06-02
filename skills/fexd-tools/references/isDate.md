# isDate

判断值是否为 Date 实例，支持跨 realm 检测。

```ts
import { isDate } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 Date 对象
- 跨 realm 安全判断

## 不适用场景

- 需要判断时间戳数字 → 用 isNumber
- 需要判断日期字符串 → 需自行 Date.parse

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

## 相关函数

- `isObject` — 判断值是否为对象
- `isNumber` — 判断值是否为数字
