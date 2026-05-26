# memoize

缓存函数结果，相同参数再次调用时直接返回缓存值。

```ts
import { memoize } from '@fexd/tools'
```

## 签名

```ts
interface CachedFunction extends Function {
  cache: Map<any, any>
}

const memoize = <T>(
  func: Function,
  options?: {
    disable?: (ctx: { cache: Map<any, any>; key: any; result: T; drop: () => void }) => boolean
  }
): CachedFunction
```

## 用法

```ts
const expensive = memoize((n) => {
  console.log('computing...')
  return n * 2
})

expensive(5)  // => computing... 10
expensive(5)  // => 10（直接返回缓存）

// 条件跳过缓存
const cachedFetch = memoize(fetchData, {
  disable: ({ result }) => result.error,
})

// 操作缓存
cachedFetch.cache        // Map 对象
cachedFetch.cache.clear() // 清空缓存
```

## 注意事项

- 缓存键基于**第一个参数**，其余参数不参与缓存判断
- `disable` 回调中的 `drop()` 可只删除当前键的缓存
