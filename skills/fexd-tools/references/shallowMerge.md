# shallowMerge

浅合并多个对象到首个对象的副本，不递归嵌套属性。

```ts
import { shallowMerge } from '@fexd/tools'
```

## 适用场景

- 合并扁平配置对象，只需覆盖第一层属性
- 确认嵌套属性不需要递归合并时
- 不希望就地修改源对象（返回第一个对象的副本）

## 不适用场景

- 嵌套对象需要递归合并 → 用 `deepMerge` 或 `merge`
- 需要仅补缺不覆盖 → 用 `merge(..., { mode: 'supplement' })`
- 需要精细控制数组合并策略 → 用 `merge`

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
merged.nested === base.nested // true（浅拷贝，嵌套引用共享）
```

## 注意事项

- 先展开 `first`，后续对象按 key 覆盖
- 仅遍历自有可枚举属性（`hasOwnProperty`）
- 嵌套对象引用共享，需深合并请用 `deepMerge` / `merge`

## 相关函数

- `deepMerge` — 递归深度合并，就地修改
- `merge` — 高级深度合并，支持 supplement/clone/数组策略
