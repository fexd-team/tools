# CombinationMatcher

组合匹配器：根据属性组合查找匹配项，筛选当前选择下有效的属性值。典型场景为电商 SKU 选择器。

```ts
import { CombinationMatcher } from '@fexd/tools'
// 旧名仍可用：import { CombJudge } from '@fexd/tools'
```

## 适用场景

- 电商 SKU 选择器：根据已选颜色/尺码动态灰化不可选项
- 多维属性筛选：任意属性组合是否存在匹配项
- 配置匹配：根据多条件组合查找对应配置项
- 联动选择器：多级联动下根据上级选择过滤下级选项

## 不适用场景

- 单一维度简单匹配，直接用 Array.find 即可
- 需要模糊匹配或权重排序的场景（只支持精确属性值匹配）
- 数据量极大（数万 SKU）且需要高性能索引的场景
- 属性维度频繁变化的动态场景（构造后属性键固定）

## 签名

```ts
class CombinationMatcher {
  list: Record<string, any> | any[]
  attr: { [key: string]: any[] }
  attrKey: string[]

  constructor(list: Record<string, any> | any[])
  have(activeAttr: Record<string, any>): boolean
  adaptedAttr(activeAttr: Record<string, any>): Record<string, any[]>
  find(activeAttr: Record<string, any>): string | undefined
}
```

## 方法

| 方法                      | 说明                                                 |
| ------------------------- | ---------------------------------------------------- |
| `have(activeAttr)`        | 判断给定属性组合是否在列表中存在匹配（支持部分匹配） |
| `adaptedAttr(activeAttr)` | 返回当前选中属性组合下，各属性的有效可选值           |
| `find(activeAttr)`        | 查找完全匹配所有属性值的商品 ID                      |

## 用法

```ts
const products = {
  'SKU-001': { color: '黑', size: 'S', material: '棉' },
  'SKU-002': { color: '黑', size: 'M', material: '棉' },
  'SKU-003': { color: '红', size: 'S', material: '棉' },
}

const matcher = new CombinationMatcher(products)

// 判断组合是否存在
matcher.have({ color: '黑', size: 'S' })
// => true

// 查看有效选项（选了黑色后，哪些 size/material 可选）
matcher.adaptedAttr({ color: '黑' })
// => { color: ['黑', '红'], size: ['S', 'M'], material: ['棉'] }

// 精确匹配
matcher.find({ color: '黑', size: 'S', material: '棉' })
// => 'SKU-001'

// 部分匹配（参数不全，返回 undefined）
matcher.find({ color: '黑' })
// => undefined（find 要求包含所有属性键）
```

## 注意事项

- 旧名 `CombJudge` / `CombJubge` 仍可用，已标记 deprecated
- `find` 要求 `activeAttr` 包含所有属性键才算匹配成功
- `adaptedAttr` 返回的是每个属性维度的「可选值」，用于 UI 灰化不可选项

## 相关函数

- `groupBy` — 按属性分组，可对 SKU 列表按单一维度归类
- `uniqByKey` — 按键去重，提取各属性维度的唯一值时可用
