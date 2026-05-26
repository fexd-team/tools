# deepMerge

递归深度合并多个对象，后者覆盖前者。

```ts
import { deepMerge } from '@fexd/tools'
```

## 签名

```ts
deepMerge(...sources: any[]): object
```

## 基本用法

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

## 行为特点

- **变参**：接收任意数量对象，自动过滤非对象参数
- **就地修改**：合并结果写入第一个有效对象
- **递归合并**：嵌套对象递归处理，非对象值直接覆盖
- **数组为值**：数组视为原子值直接替换，不递归

## 与 merge 的区别

| | `deepMerge` | `merge` |
|---|---|---|
| 参数 | 变参 `(...sources)` | 双参 `(target, source, options?)` |
| 模式 | 仅 override | override / supplement |
| 数组策略 | 固定替换 | replace / concat / combine |
| 路径控制 | 无 | `paths` 精细到字段 |
| 自定义合并 | 无 | `customMerge` |
| clone | 无（就地修改） | `clone: true` 可选 |
| 循环引用 | 不检测 | 自动保护 |
| 场景 | 简单多对象合并 | i18n、表单等需精细控制的场景 |

简单合并场景用 `deepMerge`，需要精细控制时用 `merge`。

## 注意事项

- 就地修改第一个有效对象，需要不可变请先拷贝
- 非对象参数（null/undefined/number 等）自动过滤
- 数组整体替换，不递归合并数组元素
- 不检测循环引用，有循环引用的对象请用 `merge`
