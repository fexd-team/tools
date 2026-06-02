# lock

为函数添加自动锁定机制：首次执行后锁定，后续调用返回缓存结果，直到手动解锁。

```ts
import { lock } from '@fexd/tools'
```

## 适用场景

- 防止按钮重复提交
- 防止异步操作并发执行，锁定期间返回上次结果
- 需要手动控制解锁时机的场景

## 不适用场景

- 需要自动解锁（请求结束后）→ 用 `singleflight`
- 需要按参数缓存结果 → 用 `createCachedRequest` 或 `memoize`
- 需要缓存带过期时间 → 用 `createCachedRequest`

## 签名

```ts
interface LockedFunction extends Function {
  unlock: () => void
  isLocked: () => boolean
}

interface LockConfig {
  always?: Function
  locking?: Function
}

const lock = <T>(func: Function, conf?: LockConfig): LockedFunction
```

## 用法

```ts
const lockedFetch = lock(async () => {
  const res = await fetch('/api/data')
  return res.json()
})

await lockedFetch() // 执行 fetch
await lockedFetch() // 不执行，返回缓存结果

lockedFetch.unlock()
await lockedFetch() // 再次执行

lockedFetch.isLocked() // => true / false
```

## 带回调配置

```ts
const submit = lock(
  async () => {
    /* 提交逻辑 */
  },
  {
    always: () => console.log('按钮被点击'),
    locking: () => message.warn('请勿重复提交'),
  }
)
```

## 注意事项

- 基于 `memoize` 实现，缓存键为函数引用本身
- 解锁后再次调用会重新执行并缓存新结果
- **需手动 `unlock()`**，不会在请求结束后自动解锁

## 相关函数

- `singleflight` — 合并同一时刻的并发请求，请求结束后自动解锁
- `createCachedRequest` — 缓存请求结果，按参数缓存，带过期时间
- `memoize` — 缓存纯函数结果，按第一个参数缓存
