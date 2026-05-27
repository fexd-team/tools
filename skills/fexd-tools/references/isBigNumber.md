# isBigNumber

判断数字字符串是否超出安全整数范围或存在精度丢失风险。

```ts
import { isBigNumber } from '@fexd/tools'
```

## 签名

```ts
isBigNumber(value: any): boolean
```

## 用法

```ts
isBigNumber('9007199254740992') // true（超过 MAX_SAFE_INTEGER）
isBigNumber('1e309') // true（Infinity）
isBigNumber('123.456') // false

isBigNumber('9007199254740991') // false（安全整数）
isBigNumber(1000) // false（非字符串）
```

## 注意事项

- 先 `isNumberString`，再判 `Infinity`、非安全整数、小数整数部分精度丢失
- 科学计数法会先 `expandScientificNumberString` 再分析
- `-0`、`0`、纯小数等边界返回 false；非数字字符串一律 false
