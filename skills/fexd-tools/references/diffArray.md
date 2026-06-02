# diffArray

比较两个数组，返回新增、删除和合并差异。

```ts
import { diffArray } from '@fexd/tools'
```

## 适用场景

- 对比前后两个列表，获取新增和删除的元素
- 数据同步场景，需要知道哪些元素加入、哪些移除
- 需要结构化的差异信息（而非单方向差集）

## 不适用场景

- 只需要单方向差集（A 有 B 没有）→ 用 `difference`
- 只需要交集 → 用 `intersection`
- 对象数组需要按 key 比较差异 → 本函数按引用比较

## 签名

```ts
function diffArray<T = any>(
  init: T[],
  current: T[]
): { add: T[]; remove: T[]; diff: T[] }
```

## 返回值

| 字段     | 说明                   |
| -------- | ---------------------- |
| `add`    | `current` 中新增的元素 |
| `remove` | `init` 中被删除的元素  |
| `diff`   | 所有变更元素           |

## 用法

```ts
diffArray([1, 2, 3], [2, 3, 4])
// => { add: [4], remove: [1], diff: [4, 1] }
```

## 注意事项

- 使用 `Array.includes()` 严格相等比较
- 对象元素按引用比较

## 相关函数

- `difference` — 单方向差集
- `intersection` — 多数组交集
