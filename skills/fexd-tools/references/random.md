# random

生成 `[min, max)` 区间内的随机数，默认取整。

```ts
import { random } from '@fexd/tools'
```

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
