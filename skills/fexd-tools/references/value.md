# value

依次尝试多个值或函数，返回第一个非 `undefined` 的结果。

```ts
import { value } from '@fexd/tools'
```

## 签名

```ts
const value = <T = any>(...values: any[]): T
```

## 用法

```ts
// 回退链：优先用配置，否则默认值
const port = value(() => process.env.PORT, 3000, 8080)

// 函数与字面量混用
const label = value(
  () => user?.nickname,
  () => user?.email,
  'Anonymous'
)
```

## 注意事项

- 每一项经 `run` 处理：函数会被调用，非函数直接取用
- 仅跳过 `undefined`；`null`、`0`、`''` 等 falsy 值仍会作为有效结果返回
- 从左到右短路，后续项不再求值
- 常与可选配置、环境变量、默认值合并场景配合使用
