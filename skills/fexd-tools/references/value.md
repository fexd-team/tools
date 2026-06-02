# value

依次尝试多个值或函数，返回第一个非 `undefined` 的结果。

```ts
import { value } from '@fexd/tools'
```

## 适用场景

- 多值回退链：优先用配置，否则用环境变量，再否则用默认值
- 函数与字面量混用的默认值场景
- 可选配置项链式取值

## 不适用场景

- 简单的双值回退，且项目支持 ES2020+ 或有垫片 → 用 `??` 运算符更简洁
- 简单的三值回退且无函数，且项目支持 ES2020+ → 用 `a ?? b ?? c`
- 需要按路径从对象取值 → 用 `get`
- 需要安全调用对象上的方法 → 用 `run`

## 签名

```ts
const value = <T = any>(...values: any[]): T
```

## 用法

```ts
const port = value(() => process.env.PORT, 3000, 8080)

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

## 相关函数

- `get` — 按路径安全取值
- `run` — 安全调用函数，value 内部使用 run 处理每项
