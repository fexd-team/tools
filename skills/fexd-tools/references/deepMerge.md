# deepMerge

递归深度合并多个对象，后者覆盖前者。

```ts
import { deepMerge } from '@fexd/tools'
```

## 适用场景

- 合并多个嵌套配置对象，后者覆盖前者
- 应用用户覆盖到默认选项，保留嵌套默认字段
- 简单的多对象递归合并，不需要精细控制

## 不适用场景

- 需要不可变操作（不修改源对象）→ 用 `merge(..., { clone: true })`
- 需要仅补缺不覆盖 → 用 `merge(..., { mode: 'supplement' })`
- 数组需要拼接或按索引合并 → 用 `merge(..., { arrayMerge: 'concat' | 'combine' })`
- 只需合并第一层属性 → 用 `shallowMerge`
- 对象可能存在循环引用 → 用 `merge`（自动保护）

## 签名

```ts
deepMerge(...sources: any[]): object
```

## 用法

```ts
// 双对象合并
deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })
// => { a: 1, b: { x: 1, y: 2 }, c: 3 }

// 多对象合并（后者覆盖前者）
deepMerge({ a: 1 }, { b: 2 }, { a: 99, c: 3 })
// => { a: 99, b: 2, c: 3 }

// 深层嵌套
deepMerge(
  { config: { theme: { primary: '#1890ff' } } },
  { config: { theme: { bg: '#fff' }, debug: true } }
)
// => { config: { theme: { primary: '#1890ff', bg: '#fff' }, debug: true } }
```

## 注意事项

- **就地修改第一个有效对象**，需要不可变请先拷贝或用 `merge`
- 非对象参数（null/undefined/number 等）自动过滤
- 数组视为原子值直接替换，不递归合并数组元素
- 不检测循环引用，有循环引用的对象请用 `merge`

## 相关函数

- `merge` — 高级深度合并，支持 supplement/override、路径策略、数组策略、clone、循环引用保护
- `shallowMerge` — 浅合并，仅合并第一层属性，不递归
- `compactObject` — 移除对象中的空值，非合并操作
