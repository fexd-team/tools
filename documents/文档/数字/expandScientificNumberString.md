# expandScientificNumberString

将科学计数法字符串展开为完整十进制字符串，纯字符串操作，不经过 Number 转换，零精度损失。

## 类型签名

```ts
const expandScientificNumberString = (str: string): string
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `str` | `string` | 是 | — | 需要展开的科学计数法字符串，如 `'1.5e10'`、`'-3.14e-5'` |

## 返回值

`string` — 展开后的完整十进制字符串。非科学计数法字符串或非字符串输入原样返回。

## 示例

```ts
import { expandScientificNumberString } from '@fexd/tools'

// 正指数 — 展开为大数
expandScientificNumberString('1e20')     // => '100000000000000000000'
expandScientificNumberString('1.5e10')   // => '15000000000'

// 负指数 — 展开为小数
expandScientificNumberString('1e-7')     // => '0.0000001'
expandScientificNumberString('3.14e-5')  // => '0.0000314'

// 负数
expandScientificNumberString('-2.5e3')   // => '-2500'
expandScientificNumberString('-1e-10')   // => '-0.0000000001'

// 非科学计数法 — 原样返回
expandScientificNumberString('12345')    // => '12345'
expandScientificNumberString('3.14')     // => '3.14'
```

## 注意

- 纯字符串操作，不经过 `Number` 转换，可安全处理超出 `Number.MAX_SAFE_INTEGER` 范围的数值。
- 支持正/负号、正/负指数、带小数的尾数。
- 非字符串或空字符串输入会原样返回（不会抛错）。

## 另见

- [`isBigNumber`](../判断/isBigNumber) — 判断数字字符串是否超出安全范围
- [`toFixed`](./toFixed) — 定点表示并返回 number 类型
