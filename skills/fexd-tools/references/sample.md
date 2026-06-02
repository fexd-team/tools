# sample

从数组中随机取一个元素。

```ts
import { sample } from '@fexd/tools'
```

## 适用场景

- 从数组随机取样
- 抽奖/随机选择

## 不适用场景

- 需要随机数 → 用 `random`
- 需要第一个/最后一个 → 用 `first`/`last`
- 需要多个不重复样本 → 需自行实现

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

## 相关函数

- `random` — 生成随机数，`sample` 内部依赖它生成随机下标
- `first` — 取首个元素，确定性选取
- `last` — 取末个元素，确定性选取
