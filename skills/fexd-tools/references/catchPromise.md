# catchPromise

安全包装 Promise，以 `[error, data]` 元组返回结果，避免 try/catch。

```ts
import { catchPromise } from '@fexd/tools'
```

## 签名

```ts
const catchPromise = <T = any>(
  promise: Promise<T> | (() => Promise<T>)
): Promise<[undefined, T] | [any, undefined]>
```

## 用法

```ts
// 直接传入 Promise
const [err, data] = await catchPromise(fetch('/api/user').then((r) => r.json()))
if (err) {
  console.error(err)
  return
}
console.log(data)

// 传入返回 Promise 的函数（惰性执行）
const [err2, result] = await catchPromise(() => riskyAsyncTask())
```

## 注意事项

- 成功时返回 `[undefined, data]`，失败时返回 `[err, undefined]`
- 入参为函数时通过 `run` 调用，支持同步/异步返回值
- 适合配合解构做错误分支判断，风格类似 Go 的 `err, val` 模式
