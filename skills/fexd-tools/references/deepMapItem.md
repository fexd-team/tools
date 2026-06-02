# deepMapItem

深度遍历对象或数组，对每个节点应用变换与过滤。

```ts
import { deepMapItem } from '@fexd/tools'
```

## 适用场景

- 表单数据全局格式化（如所有字符串 trim、所有数字四舍五入）
- 接口返回的深层 JSON 需要递归清洗或脱敏
- 剔除深层结构中特定路径的字段（如去掉 `__` 开头的内部属性）

## 不适用场景

- 只需修改顶层属性（直接赋值更高效）
- 需要完整的不可变数据流（对象分支会原地修改）
- 需要保留原始引用而非重建对象

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

## 相关函数

- `pickBy` — 浅层按条件挑选对象属性
- `compactObject` — 移除对象中值为 falsy 的属性，轻量级清理
