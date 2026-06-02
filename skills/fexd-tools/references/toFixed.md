# toFixed

对数字进行定点表示并返回 `number` 类型（而非字符串）。

```ts
import { toFixed } from '@fexd/tools'
```

## 适用场景

- 金额、百分比等需要固定位数的数值展示
- 表格或图表中统一小数位数
- 科学计算结果的精度截断与展示
- 配合格式化函数（如千分位）前的精度预处理

## 不适用场景

- 需要字符串类型结果时（应使用原生 `Number.toFixed()`）
- 需要向上/向下取整而非四舍五入时
- 输入可能为科学计数法字符串时（请先使用 `expandScientificNumberString`）

## 签名

```ts
const toFixed = (num?: number, fractionDigits?: number): number
```

## 参数

| 参数             | 类型     | 默认值 | 说明           |
| ---------------- | -------- | ------ | -------------- |
| `num`            | `number` | `0`    | 要处理的数字   |
| `fractionDigits` | `number` | `2`    | 保留的小数位数 |

## 用法

```ts
toFixed(3.14159) // => 3.14
toFixed(3.14159, 3) // => 3.142
toFixed(3.1, 4) // => 3.1
toFixed() // => 0
```

## 注意事项

- 与原生 `Number.toFixed()` 不同，本函数返回 `number` 而非 `string`
- 内部使用 `Number(num.toFixed(fractionDigits))`

## 相关函数

- `clamp` — 限制数值范围，可在 toFixed 前约束输入值
- `expandScientificNumberString` — 展开科学计数法，先展开再 toFixed 可避免精度丢失
