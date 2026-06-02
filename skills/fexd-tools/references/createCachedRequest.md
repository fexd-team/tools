# createCachedRequest

创建带缓存与过期时间的请求函数，内部合并并发请求（singleflight + memoize）。

```ts
import { createCachedRequest } from '@fexd/tools'
```

## 适用场景

- 请求结果在一段时间内可复用（如配置接口、用户信息）
- 按参数缓存不同请求的结果
- 同一参数的并发请求需要合并（singleflight）
- 需要缓存过期时间控制

## 不适用场景

- 只需合并并发请求，不需要缓存结果 → 用 `singleflight`
- 缓存纯函数计算结果（非异步、无过期需求）→ 用 `memoize`
- 防止按钮重复提交 → 用 `lock`

## 签名

```ts
type CachedRequest<T> = T & { cache: Map<any, any> }

const createCachedRequest = <T extends (...args: any[]) => Promise<any>>(
  request: T,
  { cacheMinutes?: number }?: { cacheMinutes?: number }
): CachedRequest<T>
```

## 用法

```ts
const fetchUser = createCachedRequest(
  (id: string) => fetch(`/api/user/${id}`).then((r) => r.json()),
  { cacheMinutes: 5 }
)

await fetchUser('1') // 发起请求
await fetchUser('1') // 5 分钟内返回缓存

fetchUser.cache.clear()
```

## 注意事项

- 默认 `cacheMinutes` 为 `1`；设为 `0` 则不自动过期
- 同一参数并发调用由 `singleflight` 合并为一次
- 请求失败时自动 `drop` 该条缓存；成功后在超时后自动清除
- 旧名 `genMemoizedFetch` 仍可导入，建议迁移

## 相关函数

- `singleflight` — 仅合并并发请求，不缓存结果
- `memoize` — 缓存纯函数结果，按第一个参数缓存，无过期
- `lock` — 防并发执行，手动解锁
