# enhancePromise

增强原生 Promise，附加 pending/fulfilled/rejected 状态查询与手动 resolve/reject。

```ts
import { enhancePromise } from '@fexd/tools'
```

## 适用场景

- 查询 Promise 执行状态（pending/fulfilled/rejected）
- 超时控制

## 不适用场景

- 简单错误处理 → 用 catchPromise
- 需要竞速 → 用 promiseGuess

## 签名

```ts
function enhancePromise<T = any>(
  promise?: Promise<T>
): Promise<T> & {
  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  isPending: () => boolean
  isNotPending: () => boolean
  isFulfilled: () => boolean
  isResolved: () => boolean
  isRejected: () => boolean
  getValue: () => T | PromiseLike<T> | undefined
  getError: () => any
}
```

## 用法

```ts
const p = enhancePromise(
  new Promise<string>((resolve) => setTimeout(() => resolve('ok'), 1000))
)

p.isPending() // => true

await p
p.isFulfilled() // => true
p.getValue() // => 'ok'

// 不传参时创建可手动控制的 Promise
const deferred = enhancePromise<number>()
deferred.resolve(42)
```

## 注意事项

- `isResolved` 与 `isFulfilled` 等价
- `resolve`/`reject` 仅在 pending 时生效，重复调用会被忽略
- 保留原生 `then`/`catch`/`finally`，可与 async/await 混用

## 相关函数

- `catchPromise` — 简单错误处理
- `promiseGuess` — 多 Promise 竞速
