# isBigNumber

判断一个数字字符串是否超出了 JavaScript 安全整数范围，即是否会在 `Number()` 转换中丢失精度。

## 语法

```ts
isBigNumber(value: any): boolean
```

## 参数

- value 任意值（需为合法的数字字符串，否则直接返回 `false`）

## 返回值

- `true` — 值为超出安全范围的大数（超过 `Number.MAX_SAFE_INTEGER` 或转为 `Infinity`）
- `false` — 其他情况

## 判断逻辑

1. 先通过 `isNumberString` 校验是否为合法数字字符串
2. 转为 `Number` 后检查：
   - 如果是 `±Infinity` → 大数
   - 如果是整数，检查 `Number.isSafeInteger` → 不安全则为大数
   - 如果是浮点数，展开科学计数法后比对整数部分是否精度丢失

## 举例

```js
import { isBigNumber } from '@fexd/tools'

// 安全范围内
isBigNumber('123')                    // false
isBigNumber('9007199254740991')       // false（MAX_SAFE_INTEGER）

// 超出安全范围
isBigNumber('9007199254740992')       // true（MAX_SAFE_INTEGER + 1）
isBigNumber('99999999999999999')      // true

// 科学计数法
isBigNumber('1e20')                   // true
isBigNumber('1e5')                    // false

// 非数字字符串
isBigNumber('hello')                  // false
isBigNumber(123)                      // false（非字符串类型）
```
