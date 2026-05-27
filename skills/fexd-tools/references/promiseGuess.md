# promiseGuess

统一处理同步/异步执行结果：executor 可能返回 Promise 或普通值，由 valuer 归一化输出。

```ts
import { promiseGuess } from '@fexd/tools'
```

## 签名

```ts
const promiseGuess =
  <T = any>(executor: Function, valuer: Function) =>
  (...args: any[]) =>
    T
```

## 用法

```ts
// valuer 签名: (err, value, ...args) => result
const fetchUser = promiseGuess(
  (id: number) => api.getUser(id), // 可能返回 Promise 或同步对象
  (err, data) => {
    if (err) return { error: err.message }
    return { name: data.name, id: data.id }
  }
)

const result = await fetchUser(1)
```

## 注意事项

- `executor` 返回值经 `isPromiseLike` 判断；为 Promise 时 resolve/reject 均走 `valuer`
- `valuer` 成功时第一个参数为 `null`，失败时为 `err`，第二个参数为 `value`（失败时为 `undefined`）
- 同步路径直接 `valuer.call(this, null, value, ...args)`，无 Promise 包装
- 适合封装来源不确定（回调/Promise/同步）的 API 适配层
