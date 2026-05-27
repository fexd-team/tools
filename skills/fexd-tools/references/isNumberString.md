# isNumberString

判断值是否为数字格式字符串（整数、小数、科学计数法）。

```ts
import { isNumberString } from '@fexd/tools'
```

## 签名

```ts
isNumberString(value: any): boolean
```

## 用法

```ts
isNumberString('42') // true
isNumberString('-1.5') // true
isNumberString('1e10') // true

isNumberString(42) // false
isNumberString('1,000') // false
isNumberString('') // false
```

## 注意事项

- 正则：`/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/`，须为 string
- 不支持前导空格、千分位、单独 `.5` 等格式
- `isBigNumber` 的前置校验依赖本函数
