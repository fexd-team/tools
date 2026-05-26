# promiseGuess

智能处理函数的同步/异步返回值。若函数返回 Promise，则异步调用 `valuer`；否则直接调用 `valuer`。

## 类型签名

```ts
const promiseGuess = <T = any>(
  executor: Function,
  valuer: Function
) => (...args: any[]): T
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `executor` | `Function` | 是 | — | 可能返回 Promise 或普通值的函数 |
| `valuer` | `Function` | 是 | — | 结果处理函数，签名为 `(err, value, ...args)` |

## 返回值

`(...args: any[]): T` — 包装后的函数。若 `executor` 返回 Promise，则 `valuer` 的调用结果也是 Promise。

## 示例

```ts
import { promiseGuess } from '@fexd/tools'

// 同步函数
const syncFn = promiseGuess(
  (x) => x * 2,
  (err, result) => result + 1
)
syncFn(3)  // => 7（(3 * 2) + 1）

// 异步函数
const asyncFn = promiseGuess(
  async (x) => x * 2,
  (err, result) => result + 1
)
await asyncFn(3)  // => 7

// 错误处理
const fn = promiseGuess(
  async () => { throw new Error('fail') },
  (err, result) => err ? 'error' : result
)
await fn()  // => 'error'
```

## 注意

- `valuer` 签名为 `(err, value, ...args)`，异步失败时 `err` 有值而非 reject。
- 通过 `isPromiseLike` 判断 `executor` 返回值是否为 Promise。
- 同步路径直接调用 `valuer` 并返回结果，异步路径返回 Promise。

## 另见

- [`catchPromise`](./catchPromise) — 安全包装 Promise 为元组
- [`enhancePromise`](./enhancePromise) — 增强 Promise 状态查询
