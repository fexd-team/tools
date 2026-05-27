# shallowMerge

浅合并多个对象到首个对象的副本，不递归嵌套属性。

```ts
import { shallowMerge } from '@fexd/tools'
```

## 签名

```ts
const shallowMerge = <T extends Record<string, any>>(
  first: T,
  ...rest: Record<string, any>[]
): T & Record<string, any>
```

## 用法

```ts
const base = { a: 1, nested: { x: 1 } }
const merged = shallowMerge(base, { b: 2 }, { a: 3 })

merged // { a: 3, nested: { x: 1 }, b: 2 }
merged.nested === base.nested // true（浅拷贝）
```

## 注意事项

- 先展开 `first`，后续对象按 key 覆盖
- 仅遍历自有可枚举属性（`hasOwnProperty`）
- 嵌套对象引用共享，需深合并请用 `deepMerge` / `merge`
