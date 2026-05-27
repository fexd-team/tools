# depsChanged

浅比较两个依赖数组是否发生变化。

```ts
import { depsChanged } from '@fexd/tools'
```

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
