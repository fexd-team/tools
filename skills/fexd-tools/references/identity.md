# identity

恒等函数，原样返回传入值，常用于函数式组合默认值。

```ts
import { identity } from '@fexd/tools'
```

## 适用场景

- 作为函数式组合（pipe/compose）中的默认或占位步骤
- 数组 `map`/`filter` 中需要透传值时替代 `x => x`
- 高阶函数的默认参数（如 `transform = identity`）
- 快速过滤 falsy 值：`array.filter(identity)`

## 不适用场景

- 需要类型转换的场景（应使用显式转换函数如 Number、String）
- 需要深拷贝或浅拷贝的场景（identity 不做任何复制）
- 需要对值做校验或变换的场景（应编写专门的校验/转换函数）

## 签名

```ts
const identity = <T>(value: T): T => value
```

## 用法

```ts
;[1, 2, 3].map(identity) // [1, 2, 3]

const list = items.filter(identity) // 过滤 falsy

pipe(parse, identity, validate)(input)
```

## 注意事项

- 纯透传，不做类型转换或克隆
- 泛型 `T` 保持输入输出类型一致

## 相关函数

- `value` — 执行值或函数，identity 是其不执行函数的特例
- `pipe` — 函数组合，identity 常作为 pipe 的默认/占位步骤
