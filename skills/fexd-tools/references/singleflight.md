# singleflight

同一时刻对同一异步请求合并等待，不重复发起（singleflight 模式）。

```ts
import { singleflight } from '@fexd/tools'
```

## 签名

```ts
type SingleflightFunction<T> = (() => Promise<T>) &
  Pick<LockedFunction, 'unlock' | 'isLocked'>

const singleflight = <T = any>(
  query: () => Promise<T>
): SingleflightFunction<T>
```

## 用法

```ts
const fetchOnce = singleflight(async () => {
  const res = await fetch('/api/config')
  return res.json()
})

// 并发调用只发起一次请求，其余等待同一 Promise
const [a, b] = await Promise.all([fetchOnce(), fetchOnce()])

fetchOnce.isLocked() // => 请求进行中为 true
fetchOnce.unlock() // 手动解锁后可再次发起
```

## 注意事项

- 基于 `lock` 实现，锁定期间重复调用复用同一 Promise
- 请求结束（成功或失败）后在 `finally` 中自动 `unlock`
- 无参数；需按参数去重时请用 `createCachedRequest` 或 `memoize`
