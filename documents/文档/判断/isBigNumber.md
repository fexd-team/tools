# isBigNumber

判断数字字符串是否超出 JavaScript 安全整数范围（会在 `Number()` 转换中丢失精度）。

## 类型签名

```ts
isBigNumber(value: any): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为超出安全范围的数字字符串时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isBigNumber } from '@fexd/tools'

// 安全范围内
isBigNumber('123')                    // => false
isBigNumber('9007199254740991')       // => false（MAX_SAFE_INTEGER）

// 超出安全范围
isBigNumber('9007199254740992')       // => true（超出安全整数）
isBigNumber('99999999999999999')      // => true
isBigNumber('1e20')                   // => true
isBigNumber('1e5')                    // => false

// 非数字字符串
isBigNumber('hello')                  // => false
isBigNumber(123)                      // => false（非字符串类型）
```

## 判断逻辑

1. 通过 `isNumberString` 校验是否为合法数字字符串
2. 转为 `Number` 后检查：`±Infinity` → 大数；整数检查 `Number.isSafeInteger`；浮点数比对精度

## 注意

- **仅接受字符串**，数字类型（如 `123`）直接返回 `false`；需先 `String(value)` 再传入。
- 内部先经 `isNumberString` 校验，非合法数字字符串一律返回 `false`。
- 判断的是 `Number()` 转换是否会丢失精度，**不是**判断数值大小；安全范围内的大浮点数（如 `'1501338859614.04'`）返回 `false`。
- 超出 `Number.MAX_VALUE` 的科学计数法（如 `'1e308'`）会返回 `true`。

## 另见

- [`isNumberString`](./isNumberString) — 判断是否为合法数字字符串
- [`isNumber`](./isNumber) — 判断是否为有效数字
- [`expandScientificNumberString`](../数字/expandScientificNumberString) — 展开科学计数法字符串