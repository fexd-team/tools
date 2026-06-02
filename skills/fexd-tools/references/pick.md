# pick / pickBy

从对象中选取属性。`pick` 按键名选取，`pickBy` 按条件选取。

```ts
import { pick, pickBy, isNumber, isString } from '@fexd/tools'
```

## 适用场景

- 从对象中提取指定键（`pick`）
- 按类型或条件过滤对象属性（`pickBy`）
- 移除对象中的 null/undefined（`pickBy` 默认行为）

## 不适用场景

- 只需移除空值（null/undefined/空字符串）→ 用 `compactObject`（更简洁）
- 需要递归深度选取或过滤 → 需自行递归处理或用 `deepMapItem`
- 需要合并对象 → 用 `deepMerge` / `merge` / `shallowMerge`

## pick 签名

```ts
const pick = (obj: Record<string, any>, keys?: any[]): Record<string, any>
```

## pickBy 签名

```ts
const pickBy = (
  obj: Record<string, any>,
  predicate?: (value: any, key: string) => boolean
): Record<string, any>
```

## 用法

```ts
const user = { id: 1, name: 'Alice', age: 25, role: null }

pick(user, ['id', 'name'])
// => { id: 1, name: 'Alice' }

pickBy(user)
// => { id: 1, name: 'Alice', age: 25 }

pickBy(user, isNumber)
// => { id: 1, age: 25 }

pickBy(user, (v, k) => k.length > 2)
// => { name: 'Alice', age: 25, role: null }
```

## 注意事项

- 始终返回新对象，不修改源对象
- `pick` 中不存在的键会被忽略
- `pickBy` 默认使用 `isExist` 过滤 null/undefined

## 相关函数

- `compactObject` — 移除对象中的空值
- `deepMapItem` — 深度遍历变换对象各节点
- `isExist` — pickBy 默认的过滤条件
