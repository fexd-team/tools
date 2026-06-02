# singleflight

同一时刻对同一异步请求合并等待，不重复发起（singleflight 模式）。

```ts
import { singleflight } from '@fexd/tools'
```

## 适用场景

- 多个组件同时请求同一个接口，应只发一次请求
- 多个调用方并发调用同一异步函数，共享同一 in-flight Promise
- 请求结束后自动解锁，无需手动管理

## 不适用场景

- 需要手动控制锁定/解锁时机 → 用 `lock`
- 需要按参数区分不同请求 → 用 `createCachedRequest`
- 请求完成后仍需缓存结果供后续使用 → 用 `createCachedRequest`
- 缓存纯函数计算结果（非异步） → 用 `memoize`

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

const [a, b] = await Promise.all([fetchOnce(), fetchOnce()])

fetchOnce.isLocked()
fetchOnce.unlock()
```

## 注意事项

- 基于 `lock` 实现，锁定期间重复调用复用同一 Promise
- 请求结束（成功或失败）后在 `finally` 中**自动 `unlock`**
- **无参数**；需按参数去重时请用 `createCachedRequest` 或 `memoize`

## 相关函数

- `lock` — 手动锁定/解锁，适合防重复提交
- `createCachedRequest` — 按参数缓存请求结果，带过期时间
- `memoize` — 缓存纯函数结果，按第一个参数缓存
