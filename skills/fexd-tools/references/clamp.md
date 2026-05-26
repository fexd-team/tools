# clamp

将数值限制在指定范围内。

```ts
import { clamp } from '@fexd/tools'
```

## 签名

```ts
function clamp(value: number, min: number, max?: number): number
```

## 用法

```ts
clamp(5, 0, 10)    // => 5
clamp(-3, 0, 10)   // => 0（低于下界）
clamp(15, 0, 10)   // => 10（超过上界）
clamp(5, 0)        // => 5（不设上界）
```

## 注意事项

- 省略 `max` 时默认 `Number.MAX_VALUE`，相当于只限制下界
- 仅接受 number 类型
