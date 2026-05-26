# diffArray

比较两个数组，返回新增、删除和合并差异。

```ts
import { diffArray } from '@fexd/tools'
```

## 签名

```ts
function diffArray<T = any>(init: T[], current: T[]): { add: T[]; remove: T[]; diff: T[] }
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `add` | `current` 中新增的元素（不在 `init` 中） |
| `remove` | `init` 中被删除的元素（不在 `current` 中） |
| `diff` | 所有变更元素（`add` + `remove` 的并集） |

## 用法

```ts
diffArray([1, 2, 3], [2, 3, 4])
// => { add: [4], remove: [1], diff: [4, 1] }
```

## 注意事项

- 使用 `Array.includes()` 严格相等比较
- 对象元素按引用比较
