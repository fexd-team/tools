# createCachedRequest

创建带缓存和去重的请求函数，结合 `singleflight`（防重复请求）和 `memoize`（结果缓存）。

## 类型签名

```ts
const createCachedRequest = <T>(
  request: T,
  options?: { cacheMinutes?: number }
): T & { cache: Map<any, any> }
```

## 参数

| 参数                   | 类型     | 必填 | 默认值 | 说明                                     |
| ---------------------- | -------- | ---- | ------ | ---------------------------------------- |
| `request`              | `T`      | 是   | —      | 原始请求函数                             |
| `options.cacheMinutes` | `number` | 否   | `1`    | 缓存过期时间（分钟），`0` 表示不自动过期 |

## 返回值

`T & { cache }` — 增强后的请求函数，附带 `.cache` 属性可手动管理缓存。

## 示例

```ts
import { createCachedRequest } from '@fexd/tools'

const fetchUser = createCachedRequest(
  (id: string) => fetch(`/api/user/${id}`).then((r) => r.json()),
  { cacheMinutes: 5 }
)

// 第一次请求：发起网络请求
const user1 = await fetchUser('123')

// 第二次请求（5 分钟内）：直接返回缓存
const user2 = await fetchUser('123')

// 手动清除缓存
fetchUser.cache.clear()
```

## 注意

- 同一参数的并发请求会被 `singleflight` 合并为一次，避免重复请求。
- 请求失败时自动清除该缓存条目，下次调用会重新请求。
- 缓存超时后自动清除，下次调用重新请求。

## 另见

- [`singleflight`](./singleflight) — 并发请求合并（singleflight 模式）
- [`memoize`](../async/memoize) — 函数结果缓存
