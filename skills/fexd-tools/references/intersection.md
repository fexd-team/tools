# intersection

返回多个数组的交集（同时出现在所有数组中的元素）。

```ts
import { intersection } from '@fexd/tools'
```

## 适用场景

- 找出多个数组共有的元素
- 多个列表取公共部分
- 简单的集合交集运算

## 不适用场景

- 需要知道 A 有但 B 没有的元素 → 用 `difference`
- 需要对比新增和删除 → 用 `diffArray`
- 对象数组需要按 key 比较公共项 → 本函数按引用比较

## 签名

```ts
const intersection = (...args: any[][]): any[]
```

## 用法

```ts
intersection([1, 2, 3], [2, 3, 4]) // => [2, 3]
intersection(['a', 'b'], ['b', 'c'], ['b']) // => ['b']
intersection([1, 2], [3, 4]) // => []
```

## 注意事项

- 使用 `includes` 判断成员，按引用相等比较对象元素
- 结果顺序取自扁平化后的去重序列
- 内部经 `flatten` 与 `Set` 去重后再过滤

## 相关函数

- `difference` — 数组差集
- `diffArray` — 结构化差异（新增/删除/全部差异）
