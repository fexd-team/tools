# createSeparatorFormatter

创建分隔符格式化函数，按固定位数插入分隔符。典型场景：数字千分位、银行卡号分组。

> 原名 `getFormatter`，已保留为别名。

```ts
import { createSeparatorFormatter } from '@fexd/tools'
```

## 签名

```ts
const createSeparatorFormatter = (options?: {
  separator?: string          // default: ' '  — 分隔符
  length?: number             // default: 3    — 每组字符数
  reverse?: boolean           // default: false — 分组方向
  isNumber?: boolean          // default: false — 数字模式（正确处理小数点）
  decimalSeparator?: string   // default: 自动推断
}) => (text: any) => string
```

## 用法

```ts
// 美式千分位
const fmtUS = createSeparatorFormatter({ separator: ',', isNumber: true })
fmtUS(1234567.89)  // '1,234,567.89'

// 欧式格式：separator=. → 小数点自动变 ,
const fmtEU = createSeparatorFormatter({ separator: '.', isNumber: true })
fmtEU(1234567.89)  // '1.234.567,89'

// 显式指定小数分隔符
const fmtCustom = createSeparatorFormatter({ separator: ',', isNumber: true, decimalSeparator: '·' })
fmtCustom(1234567.89)  // '1,234,567·89'

// 银行卡号 4 位分组
const fmtCard = createSeparatorFormatter({ separator: ' ', length: 4 })
fmtCard('6222021234567890')  // '6222 0212 3456 7890'
```

## 自动推断规则

| separator | 未指定 decimalSeparator 时 | 示例 |
| --- | --- | --- |
| `'.'` | 自动用 `','` | `1.234.567,89` |
| `','` | 保持 `'.'` | `1,234,567.89` |
| 其他 | 保持 `'.'` | `1 234 567.89` |

## 要点

- 开启 `isNumber: true` 后才处理小数点；未开启时数字先 `Math.floor` 取整再格式化
- 非数字模式下 `null`/`undefined` 原样返回；数字模式下返回空字符串
- `getFormatter` 是本函数的旧名别名（已废弃）
