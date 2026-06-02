# catchPromise

安全包装 Promise，以 `[error, data]` 元组返回结果，避免 try/catch。

```ts
import { catchPromise } from '@fexd/tools'
```

## 适用场景

- 简单的异步错误分支判断，偏好 Go 风格 `err, val` 模式
- 避免 try/catch 嵌套
- 配合解构做错误处理

## 不适用场景

- 需要复杂控制流（多层 await、条件分支）→ 用 `try/catch`
- 需要区分不同类型的错误 → `try/catch` 的 `instanceof` 判断更直接
- 同步代码的错误处理 → 用 `try/catch`

## 签名

```ts
const catchPromise = <T = any>(
  promise: Promise<T> | (() => Promise<T>)
): Promise<[undefined, T] | [any, undefined]>
```

## 用法

```ts
const [err, data] = await catchPromise(fetch('/api/user').then((r) => r.json()))
if (err) {
  console.error(err)
  return
}
console.log(data)

const [err2, result] = await catchPromise(() => riskyAsyncTask())
```

## 注意事项

- 成功时返回 `[undefined, data]`，失败时返回 `[err, undefined]`
- 入参为函数时通过 `run` 调用，支持同步/异步返回值

## 相关函数

- `enhancePromise` — 增强 Promise 状态查询
- `run` — 安全函数调用，catchPromise 内部使用
