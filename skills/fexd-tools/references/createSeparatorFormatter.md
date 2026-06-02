# createSeparatorFormatter

创建分隔符格式化函数，按固定位数插入分隔符。典型场景：数字千分位、银行卡号分组。

> 原名 `getFormatter`，已保留为别名。

```ts
import { createSeparatorFormatter } from '@fexd/tools'
```

## 适用场景

- 金额显示的千分位格式化（美式/欧式）
- 银行卡号、手机号等按固定位数分组展示
- 数据报表中大量数值的统一格式化
- 输入框实时格式化（配合 `onChange` 使用）

## 不适用场景

- 纯字符串拼接场景（非数字、非固定位数分组）
- 需要解析/还原已格式化字符串时（本函数仅做格式化，不提供反向解析）
- 需要动态改变分隔符或分组长度时（应重新创建格式化器）

## 签名

```ts
const createSeparatorFormatter =
  (options?: {
    separator?: string // default: ' '  — 分隔符
    length?: number // default: 3    — 每组字符数
    reverse?: boolean // default: false — 分组方向
    isNumber?: boolean // default: false — 数字模式（正确处理小数点）
    decimalSeparator?: string // default: 自动推断
  }) =>
  (text: any) =>
    string
```

## 用法

```ts
// 美式千分位
const fmtUS = createSeparatorFormatter({ separator: ',', isNumber: true })
fmtUS(1234567.89) // '1,234,567.89'

// 欧式格式：separator=. → 小数点自动变 ,
const fmtEU = createSeparatorFormatter({ separator: '.', isNumber: true })
fmtEU(1234567.89) // '1.234.567,89'

// 显式指定小数分隔符
const fmtCustom = createSeparatorFormatter({
  separator: ',',
  isNumber: true,
  decimalSeparator: '·',
})
fmtCustom(1234567.89) // '1,234,567·89'

// 银行卡号 4 位分组
const fmtCard = createSeparatorFormatter({ separator: ' ', length: 4 })
fmtCard('6222021234567890') // '6222 0212 3456 7890'
```

## 自动推断规则

| separator | 未指定 decimalSeparator 时 | 示例           |
| --------- | -------------------------- | -------------- |
| `'.'`     | 自动用 `','`               | `1.234.567,89` |
| `','`     | 保持 `'.'`                 | `1,234,567.89` |
| 其他      | 保持 `'.'`                 | `1 234 567.89` |

## 要点

- 开启 `isNumber: true` 后才处理小数点；未开启时数字先 `Math.floor` 取整再格式化
- 非数字模式下 `null`/`undefined` 原样返回；数字模式下返回空字符串
- `getFormatter` 是本函数的旧名别名（已废弃）

## 相关函数

- `toFixed` — 格式化前先用 toFixed 控制小数精度
- `expandScientificNumberString` — 数字含科学计数法时先展开再格式化
