# expandScientificNumberString

将科学计数法字符串展开为完整十进制字符串，纯字符串操作，不经过 Number 转换，零精度损失。

## 语法

```ts
expandScientificNumberString(str: string): string
```

## 参数

- str 需要展开的科学计数法字符串，如 `'1.5e10'`、`'-3.14e-5'`

## 返回值

- 如果输入是科学计数法字符串，返回展开后的完整十进制字符串
- 如果输入不是科学计数法（不含 `e`/`E`），原样返回
- 如果输入不是字符串或为空字符串，原样返回

## 举例

```js
import { expandScientificNumberString } from '@fexd/tools'

// 正指数 — 展开为大数
expandScientificNumberString('1e20')     // '100000000000000000000'
expandScientificNumberString('1.5e10')   // '15000000000'

// 负指数 — 展开为小数
expandScientificNumberString('1e-7')     // '0.0000001'
expandScientificNumberString('3.14e-5')  // '0.0000314'

// 负数
expandScientificNumberString('-2.5e3')   // '-2500'
expandScientificNumberString('-1e-10')   // '-0.0000000001'

// 非科学计数法 — 原样返回
expandScientificNumberString('12345')    // '12345'
expandScientificNumberString('3.14')     // '3.14'
```
