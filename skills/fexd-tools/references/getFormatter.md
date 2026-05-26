# getFormatter

创建数字/文本格式化函数，按分组插入分隔符（如千分位），支持自定义小数点分隔符和欧式格式自动推断。

```ts
import { getFormatter } from '@fexd/tools'
```

## 签名

```ts
const getFormatter = (options?: {
  separator?: string          // default: ' '  — 数字分组分隔符
  length?: number             // default: 3    — 每组字符数
  reverse?: boolean           // default: false — 是否从左到右分组
  isNumber?: boolean          // default: false — 数字模式（正确处理小数点）
  decimalSeparator?: string   // default: 自动推断
}) => (text: any) => string
```

## 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `separator` | `string` | `' '` | 数字分组分隔符 |
| `length` | `number` | `3` | 每组字符数 |
| `reverse` | `boolean` | `false` | 分组方向 |
| `isNumber` | `boolean` | `false` | 数字模式 |
| `decimalSeparator` | `string` | 自动推断 | 小数点符号；未指定时当 `separator='.'` 自动用 `','`，否则用 `'.'` |

## 用法

```ts
// 美式千分位
const fmtUS = getFormatter({ separator: ',', isNumber: true })
fmtUS(1234567.89)  // '1,234,567.89'

// 欧式格式：separator=. → 小数点自动变 ,
const fmtEU = getFormatter({ separator: '.', isNumber: true })
fmtEU(1234567.89)  // '1.234.567,89'

// 显式指定小数分隔符
const fmtCustom = getFormatter({ separator: ',', isNumber: true, decimalSeparator: '·' })
fmtCustom(1234567.89)  // '1,234,567·89'

// 每 4 位一组
const fmt4 = getFormatter({ separator: ',', isNumber: true, length: 4 })
fmt4(12345678)  // '1234,5678'

// 文本模式（银行卡号）
const fmtCard = getFormatter({ separator: ' ', length: 4 })
fmtCard('6222021234567890')  // '6222 0123 4567 890'
```

## 自动推断规则

| separator | decimalSeparator 未指定时 | 示例 |
| --- | --- | --- |
| `'.'` | 自动用 `','` | `1.234.567,89` |
| `','` | 保持 `'.'` | `1,234,567.89` |
| 其他 | 保持 `'.'` | `1 234 567.89` |

## 注意

- 开启 `isNumber: true` 后才会处理小数点；未开启时数字先 `Math.floor` 取整再格式化
- 非数字模式下 `null`/`undefined` 原样返回；数字模式下返回空字符串 `''`
- 当 `separator` 和小数点冲突时（如都是 `.`），自动推断会确保两者不同
