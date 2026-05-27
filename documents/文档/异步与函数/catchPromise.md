# catchPromise

安全包装 Promise，返回 `[error, data]` 元组，避免 try/catch 嵌套。灵感来自 Go 语言的错误处理模式。

## 类型签名

```ts
const catchPromise = <T = any>(
  promise: Promise<T> | (() => Promise<T>)
): Promise<[undefined, T] | [any, undefined]>
```

## 参数

| 参数      | 类型                               | 必填 | 默认值 | 说明                              |
| --------- | ---------------------------------- | ---- | ------ | --------------------------------- |
| `promise` | `Promise<T> \| (() => Promise<T>)` | 是   | —      | Promise 对象或返回 Promise 的函数 |

## 返回值

`Promise<[undefined, T] | [any, undefined]>` — 成功时为 `[undefined, data]`，失败时为 `[error, undefined]`。

## 示例

### 基本用法

```ts
import { catchPromise } from '@fexd/tools'

// 成功
const [err, data] = await catchPromise(fetch('/api/data'))
if (!err) {
  console.log(data)
}

// 失败
const [err, data] = await catchPromise(Promise.reject(new Error('fail')))
if (err) {
  console.error(err.message) // 'fail'
}

// 传入函数引用（延迟执行，推荐方式）
const [err, data] = await catchPromise(async () => {
  const res = await fetch('/api/user')
  return res.json()
})
```

### 与 try-catch 对比

```ts
// ── try-catch 写法：变量声明和赋值分离，需要嵌套 ──
let user, order
try {
  user = await fetchUser(1)
  try {
    order = await fetchOrder(user.id)
  } catch (e) {
    console.error('获取订单失败', e)
  }
} catch (e) {
  console.error('获取用户失败', e)
}

// ── catchPromise 写法：扁平、声明即赋值、每步错误独立 ──
const [userErr, user] = await catchPromise(fetchUser(1))
if (userErr) return console.error('获取用户失败', userErr)

const [orderErr, order] = await catchPromise(fetchOrder(user.id))
if (orderErr) return console.error('获取订单失败', orderErr)
```

### 并发场景：独立收集每个错误

```ts
const results = await Promise.all([
  catchPromise(fetchUser(1)),
  catchPromise(fetchUser(-1)), // 会失败
  catchPromise(fetchUser(2)),
])
// results[0] → [undefined, { id: 1, ... }]  ✅
// results[1] → [Error, undefined]             ❌
// results[2] → [undefined, { id: 2, ... }]  ✅
```

### 自定义错误类型分支处理

```ts
const [err, data] = await catchPromise(api())

if (err instanceof NotFoundError) {
  showEmpty()
} else if (err instanceof AuthError) {
  redirectLogin()
} else if (err) {
  showGenericError(err)
}
```

## 何时仍然需要 try-catch

`catchPromise` 并非 try-catch 的完全替代。以下场景仍应使用 try-catch：

### 1. 需要 finally 进行资源清理

```ts
// try-catch-finally 保证清理逻辑必定执行
let conn
try {
  conn = await getConnection()
  await conn.query(sql)
} catch (e) {
  reportError(e)
} finally {
  conn?.release() // 无论成功失败都必须释放
}

// catchPromise 没有 finally 语义，需要手动保证
const [err, result] = await catchPromise(query())
conn?.release() // 如果上面的 await 前有 early return，这行可能被跳过
```

### 2. 循环中需要 continue/break 控制流

```ts
// try-catch 可以直接在循环中控制流程
for (const item of items) {
  try {
    await process(item)
  } catch (e) {
    if (isFatal(e)) break // 致命错误中断循环
    continue // 非致命跳过
  }
  await afterProcess(item)
}

// catchPromise 写法等价但需额外 if
for (const item of items) {
  const [err] = await catchPromise(process(item))
  if (err && isFatal(err)) break
  if (err) continue
  await afterProcess(item)
}
```

### 3. 同步代码中混合 throw 的场景

```ts
function complexOperation() {
  validateInput(data) // 可能同步 throw
  const parsed = JSON.parse(raw) // 可能同步 throw
  return fetch('/api', { body: parsed }) // 异步
}

// 整段逻辑（同步+异步）都需要保护时，try-catch 更自然
try {
  const result = await complexOperation()
} catch (e) {
  // 捕获同步和异步的所有错误
}

// catchPromise 需要传函数引用才能覆盖同步 throw
const [err] = await catchPromise(complexOperation) // ✅ 传引用
```

### 4. 需要根据错误类型做恢复/重试策略

```ts
// 当恢复逻辑本身也可能失败时，嵌套 try-catch 更清晰
try {
  await primaryApi()
} catch (e) {
  try {
    await fallbackApi() // fallback 也可能失败
  } catch (fallbackErr) {
    await lastResort()
  }
}
```

> **经验法则：** 单层异步错误分支 → `catchPromise` 更简洁；多层嵌套恢复、finally 清理、循环控制流 → 原生 try-catch 更合适。

## ⚠️ 注意事项与陷阱

### 1. 后续操作不在保护范围内

`catchPromise` 只保护 Promise 本身的执行，拿到返回值后的操作需要自己保护：

```ts
const [err, result] = await catchPromise(api())
// ✅ catchPromise 保护到这里

result.data.items.length // ❌ 如果 data 为 null，这里会 TypeError
result?.data?.items?.length // ✅ 用可选链更安全
```

### 2. reject falsy 值的判断陷阱

```ts
// 如果 Promise reject 了 undefined / null / 0 / false
const [err, val] = await catchPromise(Promise.reject(undefined))
// err = undefined, val = undefined

if (!err) {
  // ❌ 会走到这里！误以为成功
}
```

**最佳实践：** 始终 `reject(new Error(...))` 而非 reject 原始值。

### 3. 忘记 await

```ts
const result = catchPromise(api()) // ❌ 忘了 await
// result 是 Promise 对象，不是 [err, value] 元组
// 后续 result[0] 不会报错，但值是 undefined，逻辑全错
```

### 4. 传函数引用 vs 传调用结果

```ts
// 非 async 函数中有同步 throw 的情况：
const riskyFn = () => {
  JSON.parse('invalid') // 同步 throw
  return fetch('/api')
}

const [err] = await catchPromise(riskyFn) // ✅ 传函数引用 — 同步 throw 被 catchPromise 内部 try-catch 捕获
const [err] = await catchPromise(riskyFn()) // ❌ 传调用结果 — 同步 throw 在 catchPromise 之外，直接炸
```

> **注意：** `async` 函数没有这个问题 — async 函数内的同步 throw 会自动变成 rejected Promise。

### 5. 失败时 error 类型为 `any`

`error` 的实际类型取决于 `reject` 的值，使用前需自行判断：

```ts
const [err] = await catchPromise(api())
if (err instanceof Error) {
  console.error(err.message) // 安全访问
}
```

## 另见

- [`enhancePromise`](./enhancePromise) — 增强 Promise 状态查询
- [`delay`](./delay) — 延迟 Promise
- [`lock`](./lock) — 防重复执行
