# difference

返回数组差集：arr1 中存在但 arr2 中不存在的元素。

```ts
import { difference } from '@fexd/tools'
```

## 适用场景

- 找出 A 中有但 B 中没有的元素
- 从列表中排除某些值
- 简单的集合差集运算

## 不适用场景

- 需要知道新增和删除两个方向 → 用 `diffArray`
- 需要找多个数组的公共元素 → 用 `intersection`
- 对象数组需要按 key 比较 → 本函数按引用比较，需自行处理

## 签名

```ts
function difference(arr1: any[], arr2: any[]): any[]
```

## 用法

```ts
difference([1, 2, 3, 4], [2, 4]) // => [1, 3]
difference(['a', 'b', 'c'], ['b']) // => ['a', 'c']
```

## 注意事项

- 使用 `Array.includes()` 严格相等比较
- 保留 arr1 中的顺序与重复项，不做去重
- 对象元素按引用比较，不按值比较

## 相关函数

- `intersection` — 多数组交集
- `diffArray` — 结构化差异（新增/删除/全部差异）
