# depsChanged

浅比较两个依赖数组是否发生变化。

```ts
import { depsChanged } from '@fexd/tools'
```

## 适用场景

- React Hooks / 自定义 Hook 中判断 effect 依赖是否变化
- 缓存或订阅逻辑中跳过未变化的重计算
- 请求去重：依赖不变时复用上次结果

## 不适用场景

- 需要深比较对象内容是否变化（`===` 不比较内部值）
- 比较非数组类型的值（仅支持数组）
- 依赖项中存在 NaN（`NaN !== NaN` 会导致误判）

## 签名

```ts
const depsChanged = (oldDeps: any[], newDeps: any[]): boolean
```

## 用法

```ts
const prev = [1, 'a', obj]
const next = [1, 'a', obj]

depsChanged(prev, next) // => false（引用相同）
depsChanged(prev, [1, 'a', {}]) // => true（obj 引用不同）
depsChanged([1], [1, 2]) // => true（长度不同）
```

## 注意事项

- 使用 `===` 逐项比较，不做深比较
- 长度不同立即返回 `true`
- 常用于 effect / 订阅类逻辑中判断依赖是否需重新执行

## 相关函数

- `isArray` — 判断值是否为数组，可用于前置校验
- `shallowMerge` — 浅合并对象，与浅比较搭配使用
