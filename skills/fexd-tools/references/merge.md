# merge

高级深度合并函数，将 source 合并到 target，支持多种模式和策略。

```ts
import { merge } from '@fexd/tools'
```

## 适用场景

- 需要仅补缺不覆盖已有值（supplement 模式）
- 需要不可变操作（clone 模式）
- 需要按路径精细控制合并策略
- 需要自定义数组合并方式（concat/combine）
- i18n 语言包、表单默认值等需精细控制的场景
- 对象可能存在循环引用

## 不适用场景

- 简单多对象递归合并，不需要精细控制 → 用 `deepMerge`
- 只需合并第一层属性 → 用 `shallowMerge`
- 简单的扁平对象覆盖 → 用展开运算符或 `Object.assign`

## 签名

```ts
merge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
  options?: DeepMergeOptions
): T
```

## DeepMergeOptions

```ts
interface DeepMergeOptions {
  mode?: 'override' | 'supplement'
  paths?: Record<string, MergeMode>
  clone?: boolean
  arrayMerge?: 'replace' | 'concat' | 'combine'
  isMergeableObject?: (value: any, key: string) => boolean
  customMerge?: Record<
    string,
    (targetVal: any, sourceVal: any, options?: DeepMergeOptions) => any
  >
  shallowAfterDepth?: number
}
```

## 用法

### override 模式（默认）

```ts
merge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })
// => { a: 1, b: { x: 1, y: 2 }, c: 3 }  (就地修改 target)
```

### supplement 模式（仅补缺）

```ts
merge({ a: 1, b: 2 }, { b: 99, c: 3 }, { mode: 'supplement' })
// => { a: 1, b: 2, c: 3 }  ← b 不被覆盖
```

### clone 模式

```ts
const target = { a: 1 }
const result = merge(target, { b: 2 }, { clone: true })
// target 不变, result 为新对象
```

### 路径级策略

```ts
merge(config, newConfig, {
  mode: 'supplement',
  paths: { 'types.default.resources': 'override' },
})
```

### 数组合并策略

```ts
// concat：拼接
merge({ items: [1, 2] }, { items: [3] }, { arrayMerge: 'concat' })
// => { items: [1, 2, 3] }

// combine：按索引合并
merge(
  { items: [{ id: 1, name: 'a' }] },
  { items: [{ score: 99 }] },
  { arrayMerge: 'combine' }
)
// => { items: [{ id: 1, name: 'a', score: 99 }] }
```

### 自定义合并

```ts
merge(
  { count: 5, items: [1, 2] },
  { count: 10, items: [3] },
  { customMerge: { count: (a, b) => a + b, items: (a, b) => a.concat(b) } }
)
// => { count: 15, items: [1, 2, 3] }
```

### shallowAfterDepth（性能优化）

```ts
merge(config, newConfig, { mode: 'supplement', shallowAfterDepth: 4 })
```

已知底层是扁平 key-value 时跳过递归，提速约 47%。

## 注意事项

- 默认就地修改 target，需要不可变传 `{ clone: true }`
- supplement 模式下 `null`/`0`/`''`/`false` 视为已有值，仅 `undefined` 被补足
- `customMerge` 优先级最高，跳过 mode/paths 逻辑
- 自动检测循环引用，避免栈溢出
- `shallowAfterDepth` 仅用于已知底层为扁平值的场景

## 相关函数

- `deepMerge` — 简单变参递归合并，就地修改，无精细控制
- `shallowMerge` — 浅合并，仅合并第一层属性，不递归
- `I18n.applyConfig` — I18n 配置合并，内部使用 merge + priority
