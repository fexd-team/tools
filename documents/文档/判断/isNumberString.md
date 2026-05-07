# isNumberString

判断一个值是否为合法的数字字符串。支持整数、小数和科学计数法。

## 语法

```ts
isNumberString(value: any): boolean
```

## 参数

- value 任意值

## 返回值

- `true` — 值为字符串类型，且内容是合法的数字格式
- `false` — 其他情况

## 支持的格式

| 格式 | 示例 | 结果 |
|------|------|------|
| 正整数 | `'123'` | `true` |
| 负整数 | `'-456'` | `true` |
| 显式正号 | `'+789'` | `true` |
| 小数 | `'3.14'` | `true` |
| 科学计数法 | `'1e10'`、`'1.5E-3'` | `true` |
| 前导零 | `'007'` | `true` |
| 仅小数点 | `'1000.'`、`'.5'` | `false` |
| 非字符串 | `123`、`null` | `false` |

## 举例

```js
import { isNumberString } from '@fexd/tools'

isNumberString('123')        // true
isNumberString('-3.14')      // true
isNumberString('1.5e10')     // true
isNumberString('1E-7')       // true

isNumberString('abc')        // false
isNumberString('12.34.56')   // false
isNumberString('')           // false
isNumberString(123)          // false（非字符串类型）
```
