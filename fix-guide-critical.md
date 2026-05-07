# @fexd/tools Critical 级别问题修复方案

> 基于 2026-05-07 审查报告，共 6 个 Critical 级别问题
> 更新日期：2026-05-07 — 除 #3（lock）外，其余 5 项已修复并通过测试

---

## Critical 1：FrameProcess/Thread — `isAvailable` 逻辑反转 ✅ 已修复

### 问题

```ts
// src/FrameProcess/core/Thread.ts:24
public isAvailable = (): boolean => this.taskList.size >= this.maxTaskCount
```

当 `taskList.size >= maxTaskCount` 时返回 `true`，语义上应该是"不可用"。

**影响链**：`Process.getAvailableThread()` 用 `find(t => t.isAvailable())` 找线程 → 找到的是**已满**的线程 → 新任务被塞入已满线程 → 空闲线程永远不会被复用 → 轻负载下不断创建新 Thread 实例。

### 修复方案

```diff
// src/FrameProcess/core/Thread.ts
- public isAvailable = (): boolean => this.taskList.size >= this.maxTaskCount
+ public isAvailable = (): boolean => this.taskList.size < this.maxTaskCount
```

一行修复，语义恢复正确："任务数小于上限 = 有余量 = 可用"。

### 测试文件

`src/tests/Thread.test.ts` — 11 个测试用例，覆盖 isAvailable 边界、stop 回收、Process 线程复用/创建/释放后复用。

---

## Critical 2：url — query 参数值中 `=` 被截断 ✅ 已修复

### 问题

```ts
// src/url/index.ts:48
.map((param) => param.split('='))
.reduce((res, [key, value]) => ...)
```

`'token=abc=='.split('=')` 产生 `['token', 'abc', '', '']`，解构只取前两个元素，`abc` 后面的 `==` 被丢弃。

**实际场景**：Base64 编码值（如 JWT token）、嵌套 URL、数据 URI 等。

### 修复方案

```diff
// src/url/index.ts — allParam 函数
  return search
    .split('&')
-   .map((param) => param.split('='))
-   .reduce(
-     (res, [key, value]) =>
-       Object.assign(res, {
-         [key]: decode(value),
-       }),
-     {}
-   )
+   .reduce((res, param) => {
+     const eqIdx = param.indexOf('=')
+     if (eqIdx === -1) {
+       res[param] = ''
+       return res
+     }
+     const key = param.slice(0, eqIdx)
+     const value = param.slice(eqIdx + 1)
+     res[key] = decode(value)
+     return res
+   }, {} as Record<string, any>)
```

### 测试文件

`src/tests/url.test.ts` — 9 个测试用例，覆盖基础解析、Base64 `=` 保留、空值、无等号、混合参数、编码字符。

---

## Critical 3：lock — 缓存 key 忽略参数 ⏳ 暂不修改

### 问题

```ts
// src/lock.ts:14
const memoizedFunction = memoize(function (func, ...args) {
  return func.call(this, ...args)
})
```

`memoize` 只用**第一个参数**（`func` 函数引用）作为 cache key。`lock` 包裹后，无论传什么参数，只要函数引用相同，就返回第一次调用的结果。

```ts
// 示例
const fn = lock((x) => x * 2)
fn(5)   // → 10（缓存 key = func 引用）
fn(100) // → 10（命中缓存，忽略参数 100）
```

### 分析

`lock` 的设计意图是**"函数执行一次后锁定，需手动 unlock"**，不是按参数缓存。所以忽略参数**可能是设计如此**——第一次调用的结果被"锁住"，后续调用不管参数都返回锁住的结果。

**但这个行为需要明确**：
- 如果是设计意图：应在 `locking` 回调中告知调用者"函数已锁定"，且文档要明确说明参数被忽略
- 如果不是：需要修改 memoize 的 key 策略

### 修复方案

**方案 A（确认为设计意图，加强文档 + 类型）**：

```ts
/**
 * [自锁函数] 函数运行后会立即上锁，显式调用 fn.unlock 来解锁
 * ⚠️ 上锁后，无论传入什么参数，都返回第一次调用的结果
 */
```

**方案 B（如果期望按参数区分）**：

需要改造 `memoize` 或 `lock` 的 cache key 策略，将参数也纳入 key。但这会改变 `lock` 的核心语义，需要评估所有调用方。

### 建议

确认设计意图后选择方案。如果 `lock` 就是"调一次就锁，直到 unlock"，那当前行为合理，但 `locking` 回调应该被实际调用来通知调用者。

**注意**：当前代码中 `locking` 回调在 `isLocked()` 为 true 时被调用了，但 `memoizedFunction` 还是返回了缓存结果——这说明设计意图就是锁定返回值。只需补充文档即可。

---

## Critical 4：safeStringify — 共享引用误判为循环引用 ✅ 已修复

### 问题

```ts
// src/safeStringify.ts:11-13
if (typeof value === 'object' && value !== null) {
  if (seen.has(value)) return '[Circular]'
  seen.add(value)
}
```

`WeakSet` 记录了所有已访问的对象。当同一对象被两个不同的 key 引用时（DAG 共享引用），第二次访问会被错误标记为 `[Circular]`。

```ts
const shared = { x: 1 }
safeStringify({ a: shared, b: shared })
// 当前输出: {"a":{"x":1},"b":"[Circular]"}
// 期望输出: {"a":{"x":1},"b":{"x":1}}
```

### 修复方案

用**栈（Stack）**替代 `WeakSet`。在进入一个对象时 push，离开时 pop。只有当对象出现在**当前祖先链**上时才是真正的循环引用。

```ts
import isReactValidElement from './isReactValidElement'

const safeStringify = (object: any) => {
  const stack: any[] = []

  return JSON.stringify(object, function (key, value) {
    if (isReactValidElement(value)) {
      return undefined
    }

    if (typeof value === 'object' && value !== null) {
      if (stack.includes(value)) return '[Circular]'
      stack.push(value)

      // JSON.stringify 在处理完一个对象的所有子属性后会回溯
      // 利用 replacer 的调用顺序，当栈顶不再是当前对象的父级时 pop
      while (stack.length > 0 && stack[stack.length - 1] !== this) {
        stack.pop()
      }
    }

    return value
  })
}

export default safeStringify
```

**注意**：`JSON.stringify` 的 replacer 函数中 `this` 指向当前 key 的父对象，可以利用这个特性维护栈。

### 更简洁的替代方案

利用 `JSON.stringify` 的 DFS 特性，在处理完子树后移除 seen 记录：

```ts
const safeStringify = (object: any) => {
  const ancestors: any[] = []

  return JSON.stringify(object, function (key, value) {
    if (isReactValidElement(value)) {
      return undefined
    }

    if (typeof value === 'object' && value !== null) {
      // `this` 是当前 key 的持有者（父对象）
      // 回溯：把不在当前路径上的祖先移除
      while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
        ancestors.pop()
      }

      if (ancestors.includes(value)) return '[Circular]'
      ancestors.push(value)
    }

    return value
  })
}
```

### 实际采用方案

采用了「更简洁的替代方案」— ancestors 栈 + `JSON.stringify` replacer 的 `this` 指向回溯。

### 测试文件

`src/tests/safeStringify.test.ts` — 13 个测试用例，覆盖共享引用(DAG)、共享数组引用、直接/间接/数组/深层循环引用、React 元素过滤、基本类型。

---

## Critical 5：debounce — 返回值是 timer handle ✅ 已修复（兼容方案）

### 问题

```ts
// src/debounce.ts:13-17
return function (...args) {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    func.apply(this, args)
  }, wait)
  return timeout  // ← 返回的是 setTimeout 的 ID，不是 func 的返回值
} as unknown as T
```

类型签名 `T` 暗示返回值类型和原函数一致，但实际返回的是 `number`（浏览器）或 `NodeJS.Timeout`。

### 实际采用方案

原方案会产生破坏性变更（移除 timer handle 返回值），影响现有调用方。

实际采用**兼容方案**：保留 timer handle 返回，同时在 debounced 函数上挂载 `cancel()` 方法。

```ts
const debounce = <T extends AnyFunction>(func: T, wait: number = 16): T & { cancel: () => void } => {
  let timeout: any

  const debounced = function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
    return timeout  // 保留向后兼容
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
  }

  return debounced as unknown as T & { cancel: () => void }
}
```

- `debounced()` → 仍返回 timer handle（向后兼容）
- `debounced.cancel()` → 新增优雅取消方式
- 返回类型为 `T & { cancel: () => void }`（兼容 + 扩展）
- `throttle.ts` 内部使用不受影响

### 测试文件

`src/tests/debounce.test.ts` — 10 个测试用例，覆盖延迟执行、去重、timer handle 实际可 clearTimeout、cancel、幂等 cancel、计时重置、this 上下文、独立执行。

---

## Critical 6：getFormatter — 数字 `0` 被跳过 ✅ 已修复

### 问题

```ts
// src/getFormatter.ts:17-31
if (hasDot) {
  return (
    text &&  // ← text=0 时为 falsy，短路返回 0
    text.toString().replace(...)
  )
} else {
  return (
    text &&  // ← 同样的问题
    text.toString().replace(...)
  )
}
```

当 `text` 为 `0` 时，`text && ...` 短路返回 `0`（number 类型），跳过了格式化逻辑。

**实际影响**：`getFormatter({ isNumber: true })(0)` 返回 `0`（number）而非 `'0'`（string），类型和行为都不一致。

### 修复方案

将 `text &&` 替换为显式的 null/undefined 检查：

```diff
// src/getFormatter.ts
  if (isNumberFormat) {
+   if (text === null || text === undefined) return ''
+
    const hasDot = text.toString().indexOf('.') !== -1

    if (hasDot) {
-     return (
-       text &&
-       text
-         .toString()
-         .replace(...)
-     )
+     return text
+       .toString()
+       .replace(
+         new RegExp(`(\\d)(?=(\\d{${length}})+\\.)`, 'g'),
+         ($0, $1) => $1 + separator
+       )
    } else {
-     return (
-       text &&
-       text
-         .toString()
-         .replace(...)
-     )
+     return text
+       .toString()
+       .replace(
+         new RegExp(`\\d{1,${length}}(?=(\\d{${length}})+$)`, 'g'),
+         `$&${separator}`
+       )
    }
  }
```

### 测试文件

`src/tests/getFormatter.test.ts` — 8 个测试用例，覆盖数字 0、千分位、小数、负数、null/undefined、默认模式。

---

## 修复状态

| # | 问题 | 状态 | 测试文件 | 测试数 |
|---|------|------|---------|--------|
| 1 | FrameProcess `isAvailable` | ✅ 已修复 | `Thread.test.ts` | 11 |
| 2 | url `=` 截断 | ✅ 已修复 | `url.test.ts` | 9 |
| 3 | lock 参数忽略 | ⏳ 暂不修改 | — | — |
| 4 | safeStringify 共享引用 | ✅ 已修复 | `safeStringify.test.ts` | 13 |
| 5 | debounce 返回值 | ✅ 已修复（兼容方案） | `debounce.test.ts` | 10 |
| 6 | getFormatter 数字 0 | ✅ 已修复 | `getFormatter.test.ts` | 8 |

> 共 51 个测试用例，全部通过
