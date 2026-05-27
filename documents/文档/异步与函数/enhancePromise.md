# enhancePromise

增强 Promise，添加状态查询和手动 resolve/reject 能力。

## 类型签名

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

## 参数

| 参数      | 类型         | 必填 | 默认值 | 说明                                                 |
| --------- | ------------ | ---- | ------ | ---------------------------------------------------- |
| `promise` | `Promise<T>` | 否   | —      | 要包装的 Promise；不传则创建可外部控制的延迟 Promise |

## 返回值

增强后的 Promise，附加状态查询和控制方法。

## 方法

| 方法             | 说明                              |
| ---------------- | --------------------------------- |
| `resolve(value)` | 手动 resolve（仅 pending 时有效） |
| `reject(reason)` | 手动 reject（仅 pending 时有效）  |
| `isPending()`    | 是否仍在等待                      |
| `isNotPending()` | 是否已结束（不再等待）            |
| `isFulfilled()`  | 是否已成功（等同于 `isResolved`） |
| `isResolved()`   | 是否已 resolve                    |
| `isRejected()`   | 是否已 reject                     |
| `getValue()`     | 获取当前成功值                    |
| `getError()`     | 获取当前错误值                    |

## 示例

```ts
import { enhancePromise } from '@fexd/tools'

// 包装已有 Promise
const enhanced = enhancePromise(fetch('/api/data'))
enhanced.isPending() // => true

await enhanced
enhanced.isFulfilled() // => true
enhanced.getValue() // => Response object

// 创建可外部控制的 Promise
const deferred = enhancePromise()
deferred.isPending() // => true

// 稍后手动 resolve
setTimeout(() => deferred.resolve('hello'), 1000)
await deferred // => 'hello'
```

```ts
// 包装已有 Promise
const enhanced = enhancePromise(fetch('/api/data'))
enhanced.isPending() // => true

// 手动 reject
enhanced.reject(new Error('timeout'))
enhanced.isFulfilled() // => false
enhanced.getError() // => Error: timeout
```

## 注意

- `resolve` / `reject` 仅在 pending 状态下有效，Promise 已 settled 后调用无效。
- 不传 `promise` 时创建可外部手动控制的延迟 Promise。
- `isFulfilled()` 与 `isResolved()` 等价，均表示已成功 resolve。

## 另见

- [`catchPromise`](./catchPromise) — 安全包装 Promise 为元组
