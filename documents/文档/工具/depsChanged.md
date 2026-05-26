# depsChanged

比较两个依赖数组是否发生变化（类似 React 的 deps 浅比较）。

> 📌 原名 `compare`，已重命名为 `depsChanged`。`compare` 仍可用作兼容别名。

## 类型签名

```ts
const depsChanged = (oldDeps: any[], newDeps: any[]): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `oldDeps` | `any[]` | 是 | — | 旧的依赖数组 |
| `newDeps` | `any[]` | 是 | — | 新的依赖数组 |

## 返回值

`boolean` — 当两个数组**不同**时返回 `true`，完全相同时返回 `false`。

## 示例

```ts
import { depsChanged } from '@fexd/tools'

depsChanged([1, 2, 3], [1, 2, 3])    // => false（相同）
depsChanged([1, 2], [1, 2, 3])       // => true（长度不同）
depsChanged([1, 'a'], [1, 'b'])      // => true（元素不同）

const obj = { a: 1 }
depsChanged([obj], [obj])            // => false（同一引用）
depsChanged([{ a: 1 }], [{ a: 1 }]) // => true（不同引用）
```

## 注意

- 使用严格相等（`!==`）逐项比较，对象/数组按引用判断。
- 长度不同时直接返回 `true`。

## 另见

- [`difference`](./difference) — 数组差集
- [`diffArray`](./diffArray) — 数组差异计算
