# isNumberString

判断值是否为合法的数字字符串。支持整数、小数和科学计数法格式。

## 类型签名

```ts
isNumberString(value: any): boolean
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为字符串且内容符合数字格式时返回 `true`，否则返回 `false`。

## 支持的格式

| 格式       | 示例                 | 结果    |
| ---------- | -------------------- | ------- |
| 正整数     | `'123'`              | `true`  |
| 负整数     | `'-456'`             | `true`  |
| 显式正号   | `'+789'`             | `true`  |
| 小数       | `'3.14'`             | `true`  |
| 科学计数法 | `'1e10'`、`'1.5E-3'` | `true`  |
| 前导零     | `'007'`              | `true`  |
| 仅小数点   | `'1000.'`、`'.5'`    | `false` |
| 非字符串   | `123`、`null`        | `false` |

## 示例

```ts
import { isNumberString } from '@fexd/tools'

isNumberString('123') // => true
isNumberString('-3.14') // => true
isNumberString('1.5e10') // => true
isNumberString('1E-7') // => true
isNumberString('abc') // => false
isNumberString('12.34.56') // => false
isNumberString('') // => false
isNumberString(123) // => false
```

## 注意

- **仅接受字符串类型**，`123` 等数字字面量返回 `false`；需先转为字符串再判断。
- 不支持仅小数点形式：`'1000.'`、`.5` 返回 `false`（整数/小数部分不可省略）。
- 只校验格式合法性，**不**保证 `Number(value)` 的语义正确性（如 `'007'` 合法但含前导零）。
- 与 `isNumber` 不同：后者判断运行时数字类型，本函数判断字符串内容是否为数字格式。

## 另见

- [`isBigNumber`](./isBigNumber) — 判断是否超出安全整数范围
- [`isNumber`](./isNumber) — 判断是否为有效数字
- [`expandScientificNumberString`](../format/expandScientificNumberString) — 展开科学计数法字符串
