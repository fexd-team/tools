# @fexd/tools 新增函数：expandScientific

## 功能说明

将科学计数法表示的数字字符串展开为完整的十进制字符串，**纯字符串操作，零精度损失**。

用于配合 `isBigNumber` 在 JSON 大数字处理场景中使用：当一个大数字以科学计数法形式出现（如 `1e20`）时，将其展开为完整形式（如 `100000000000000000000`）后存储为字符串，保证数值可读且无精度损失。

## 函数签名

```typescript
/**
 * 将科学计数法字符串展开为完整十进制字符串
 * 纯字符串操作，不经过 Number 转换，零精度损失
 *
 * @example
 * expandScientific('1e20')                    // '100000000000000000000'
 * expandScientific('9.007199254740993e15')    // '9007199254740993'
 * expandScientific('5e-7')                    // '0.0000005'
 * expandScientific('123.456')                 // '123.456'（非科学计数法原样返回）
 */
export function expandScientific(str: string): string
```

## 实现

```typescript
export function expandScientific(str: string): string {
  if (!/[eE]/.test(str)) return str

  const isNegative = str.startsWith('-')
  const absStr = isNegative ? str.slice(1) : str
  const [mantissa, expStr] = absStr.split(/[eE]/)
  const exp = parseInt(expStr, 10)
  const [intPart, decPart = ''] = mantissa.split('.')

  const allDigits = intPart + decPart
  const decPos = intPart.length + exp

  let result: string
  if (decPos >= allDigits.length) {
    // 小数点在所有数字右侧：补零
    // 例: 1.5e15 → "15" + "0" x 14 = "1500000000000000"
    result = allDigits + '0'.repeat(decPos - allDigits.length)
  } else if (decPos <= 0) {
    // 小数点在所有数字左侧：前补零
    // 例: 5e-7 → "0." + "0" x 6 + "5" = "0.0000005"
    result = '0.' + '0'.repeat(-decPos) + allDigits
  } else {
    // 小数点在数字中间：插入小数点
    // 例: 1.23456e3 → "123.456"
    result = allDigits.slice(0, decPos) + '.' + allDigits.slice(decPos)
  }

  return (isNegative ? '-' : '') + result
}
```

## 测试用例

```typescript
// 正指数 - 大整数
expect(expandScientific('1e20')).toBe('100000000000000000000')
expect(expandScientific('1e0')).toBe('1')
expect(expandScientific('1e1')).toBe('10')
expect(expandScientific('1e308')).toBe('1' + '0'.repeat(308))

// 正指数 - 带小数的大数
expect(expandScientific('1.5e15')).toBe('1500000000000000')
expect(expandScientific('9.007199254740993e15')).toBe('9007199254740993')
expect(expandScientific('1.23e2')).toBe('123')
expect(expandScientific('1.23456e3')).toBe('1234.56')

// 负指数 - 极小浮点
expect(expandScientific('5e-7')).toBe('0.0000005')
expect(expandScientific('1.5e-3')).toBe('0.0015')
expect(expandScientific('1e-1')).toBe('0.1')
expect(expandScientific('1e-20')).toBe('0.' + '0'.repeat(19) + '1')

// 负数
expect(expandScientific('-3.14e10')).toBe('-31400000000')
expect(expandScientific('-5e-7')).toBe('-0.0000005')
expect(expandScientific('-1e20')).toBe('-100000000000000000000')

// 非科学计数法 - 原样返回
expect(expandScientific('123.456')).toBe('123.456')
expect(expandScientific('9007199254740993')).toBe('9007199254740993')
expect(expandScientific('0')).toBe('0')
expect(expandScientific('-0.001')).toBe('-0.001')

// 大写 E
expect(expandScientific('1.5E+15')).toBe('1500000000000000')
expect(expandScientific('5E-7')).toBe('0.0000005')

// 带 + 号的指数
expect(expandScientific('1.5e+15')).toBe('1500000000000000')
expect(expandScientific('1e+20')).toBe('100000000000000000000')
```

## 使用场景

### 在 JSON numberParser 中配合 isBigNumber 使用

```typescript
import { isBigNumber, expandScientific } from '@fexd/tools'

const numberParser = (_key, str) => {
  if (isBigNumber(str)) {
    return expandScientific(str)
  }
  return Number(str)
}

// 后端返回 {"amount": 1e20}
// → numberParser 收到 "1e20"
// → isBigNumber("1e20") = true
// → expandScientific("1e20") = "100000000000000000000"
// → 最终结果: { amount: "100000000000000000000" }
```

### 单独使用

```typescript
import { expandScientific } from '@fexd/tools'

expandScientific('9.007199254740993e15')
// → "9007199254740993"（零精度损失，不经过 Number 转换）
```
