# createCachedRequest

创建带缓存与过期时间的请求函数，内部合并并发请求（singleflight + memoize）。

```ts
import { createCachedRequest } from '@fexd/tools'
```

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

fetchUser.cache.clear() // 手动清空
```

## 注意事项

- 默认 `cacheMinutes` 为 `1`；设为 `0` 则不自动过期（仍缓存直至失败或手动清除）
- 同一参数并发调用由 `singleflight` 合并为一次
- 请求失败时自动 `drop` 该条缓存；成功后在超时后自动清除
- 旧名 `genMemoizedFetch` 仍可从包中导入，建议迁移到本函数
