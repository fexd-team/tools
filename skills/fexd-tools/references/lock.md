# lock

为函数添加自动锁定机制：首次执行后锁定，后续调用返回缓存结果，直到手动解锁。

```ts
import { lock } from '@fexd/tools'
```

## 签名

```ts
interface LockedFunction extends Function {
  unlock: () => void
  isLocked: () => boolean
}

interface LockConfig {
  always?: Function    // 每次调用都触发（无论是否已锁）
  locking?: Function   // 已锁状态下调用时触发
}

const lock = <T>(func: Function, conf?: LockConfig): LockedFunction
```

## 用法

```ts
const lockedFetch = lock(async () => {
  const res = await fetch('/api/data')
  return res.json()
})

await lockedFetch()    // 执行 fetch
await lockedFetch()    // 不执行，返回缓存结果

lockedFetch.unlock()
await lockedFetch()    // 再次执行

lockedFetch.isLocked() // => true / false
```

## 带回调配置

```ts
const submit = lock(
  async () => { /* 提交逻辑 */ },
  {
    always: () => console.log('按钮被点击'),
    locking: () => message.warn('请勿重复提交'),
  }
)
```

## 注意事项

- 基于 `memoize` 实现，缓存键为函数引用本身
- 解锁后再次调用会重新执行并缓存新结果
