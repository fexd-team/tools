# segment

将一个数值随机分成若干段，每段长度在指定范围内。

```ts
import { segment } from '@fexd/tools'
```

## 签名

```ts
function segment(length: number, count: number, [min, max]: number[]): number[]
```

## 用法

```ts
segment(100, 5, [10, 30])
// => [22, 15, 28, 18, 17]（每次结果不同，各段之和 = 100）

segment(50, 3, [10, 20])
// => [16, 14, 20]
```

## 注意事项

- 若 `length / count` 超出 `[min, max]` 范围，会抛出错误 `'无法分段'`
- 结果为浮点数
