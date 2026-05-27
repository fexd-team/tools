# deepMapItem

深度遍历对象或数组，对每个节点应用变换与过滤。

```ts
import { deepMapItem } from '@fexd/tools'
```

## 签名

```ts
const deepMapItem = (
  object: any,
  options?: {
    handleItem?: (item: any, key: any, keyPath: any[]) => any
    filterItem?: (item: any, key: any, keyPath: any[]) => boolean
    prefixKeys?: any[]
  }
): any
```

## 用法

```ts
// 将所有叶子数字翻倍
deepMapItem(
  { a: { b: 1 }, c: [2, 3] },
  {
    handleItem: (item) => (typeof item === 'number' ? item * 2 : item),
  }
)
// => { a: { b: 2 }, c: [4, 6] }

// 跳过指定路径（filterItem 返回 false 时不递归、不变换）
deepMapItem(data, {
  filterItem: (_item, _key, keyPath) => keyPath[0] !== 'skip',
})
```

## 注意事项

- `handleItem` 默认原样返回；`filterItem` 默认 `true`（继续处理）
- `keyPath` 为从根到当前节点的键路径数组
- 对象分支**原地修改**属性后，根节点再经 `handleItem` 处理；数组分支返回新映射结果
- `filterItem` 返回 `false` 时保留原值且不再深入
