# toFixed

对数字进行定点表示并返回 `number` 类型（而非字符串）。

```ts
import { toFixed } from '@fexd/tools'
```

## 签名

```ts
const toFixed = (num?: number, fractionDigits?: number): number
```

## 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `num` | `number` | `0` | 要处理的数字 |
| `fractionDigits` | `number` | `2` | 保留的小数位数 |

## 用法

```ts
toFixed(3.14159)     // => 3.14
toFixed(3.14159, 3)  // => 3.142
toFixed(3.1, 4)      // => 3.1
toFixed()            // => 0
```

## 注意事项

- 与原生 `Number.toFixed()` 不同，本函数返回 `number` 而非 `string`
- 内部使用 `Number(num.toFixed(fractionDigits))`
