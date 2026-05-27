# identity

恒等函数，原样返回传入值，常用于函数式组合默认值。

```ts
import { identity } from '@fexd/tools'
```

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
