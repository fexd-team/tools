# random

生成 `[min, max)` 区间内的随机数，默认取整。

```ts
import { random } from '@fexd/tools'
```

## 适用场景

- 生成验证码、随机索引、模拟数据
- 游戏/动画中的随机位置、随机延迟
- 随机抽样、洗牌算法的基础
- 配合 `segment` 进行随机分段

## 不适用场景

- 密码学安全场景（如生成密钥、令牌），应使用 `crypto.getRandomValues`
- 需要可复现的伪随机序列时
- 需要包含上界的随机整数时（本函数上界不包含）

## 签名

```ts
const random = (min: number, max: number, int?: boolean): number
```

## 用法

```ts
random(1, 10) // 1~9 的整数
random(0, 1, false) // [0, 1) 浮点数
random(-5, 5) // -5~4 的整数
```

## 注意事项

- 基于 `Math.random()`，非密码学安全随机
- 第三参 `int` 默认为 `true`，`false` 时返回浮点
- 上界 `max` 不包含（`Math.floor` 后小于 max）

## 相关函数

- `uniqueId` — 生成唯一 ID 时内部使用 random 产生随机部分
- `sample` — 从数组中随机取样，基于 random 实现
- `segment` — 随机分段函数，内部使用 random
