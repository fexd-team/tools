# sample

从数组中随机取一个元素。

```ts
import { sample } from '@fexd/tools'
```

## 签名

```ts
const sample = <T = any>(array: any[]): T
```

## 用法

```ts
sample([1, 2, 3, 4, 5]) // => 随机其中一个，如 3
sample(['a', 'b', 'c']) // => 随机其中一个
sample([]) // => undefined
```

## 注意事项

- 内部用 `random(0, length)` 生成下标，经 `get` 安全取值
- 空数组返回 `undefined`
- 每次调用独立随机，不保证不重复
