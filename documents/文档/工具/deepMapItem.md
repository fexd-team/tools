# deepMapItem

深度遍历对象/数组，对每个元素执行变换函数。

## 类型签名

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

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `object` | `any` | 是 | — | 要遍历的对象或数组 |
| `options.handleItem` | `Function` | 否 | `identity` | 对每个元素的变换函数，接收 `(item, key, keyPath)` |
| `options.filterItem` | `Function` | 否 | `() => true` | 过滤函数，返回 `false` 跳过该元素的深度遍历和变换 |
| `options.prefixKeys` | `any[]` | 否 | `[]` | 初始路径前缀 |

## 返回值

`any` — 变换后的数据结构。

## 示例

```ts
import { deepMapItem } from '@fexd/tools'

// 所有字符串转大写
deepMapItem({ name: 'alice', info: { city: 'beijing' } }, {
  handleItem: (item) => typeof item === 'string' ? item.toUpperCase() : item,
})
// => { name: 'ALICE', info: { city: 'BEIJING' } }

// 数组也支持
deepMapItem([1, [2, [3]]], {
  handleItem: (item) => typeof item === 'number' ? item * 2 : item,
})
// => [2, [4, [6]]]
```

## 注意

- 对数组返回新数组，对对象**原地修改**（mutate）。
- `handleItem` 先递归处理子元素，再对当前元素调用——即自底向上。
- `keyPath` 为从根到当前元素的完整路径数组。

## 另见

- [`get`](./get) — 按路径安全取值
- [`set`](./set) — 按路径安全设值
