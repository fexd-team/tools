# @fexd/tools 代码审查报告

> 审查日期：2026-05-07
> 审查范围：src/ 下所有 73 个导出模块
> 更新日期：2026-05-07 — Critical 级别已修复 5/6 项

---

## 🔴 Critical — 需要尽快修复

### 1. `FrameProcess/Thread` — `isAvailable` 逻辑反了 ✅ 已修复

`>=` → `<`，语义恢复为"任务数小于上限 = 可用"。测试文件：`src/tests/Thread.test.ts`（11 用例）

### 2. `url` — query 参数值中的 `=` 被截断 ✅ 已修复

`split('=')` → `indexOf('=')` 手动拆分，完整保留值中的 `=`。测试文件：`src/tests/url.test.ts`（9 用例）

### 3. `lock.ts` — 缓存 key 忽略参数 ⏳ 暂不修改

`lock` 基于 `memoize`，但 cache key 只取第一个参数（函数引用本身）。当前行为可能就是设计意图（"调一次锁死"），待确认后决定方案。

### 4. `safeStringify` — 共享引用被误判为循环引用 ✅ 已修复

`WeakSet` → ancestors 栈，利用 `JSON.stringify` replacer 的 `this` 指向进行回溯。共享引用（DAG）不再被误标为 `[Circular]`。测试文件：`src/tests/safeStringify.test.ts`（13 用例）

### 5. `debounce.ts` — 返回值是 timer handle ✅ 已修复（兼容方案）

保留 timer handle 返回（向后兼容），新增 `debounced.cancel()` 方法。返回类型扩展为 `T & { cancel: () => void }`。测试文件：`src/tests/debounce.test.ts`（10 用例）

### 6. `getFormatter` — 数字 `0` 被跳过 ✅ 已修复

`text && ...` 短路 → 显式 null/undefined 检查 + `text.toString()` 统一处理。测试文件：`src/tests/getFormatter.test.ts`（8 用例）

---

## 🟡 Warning — 建议修复

### 数据处理函数

| 函数 | 问题 | 建议 |
|------|------|------|
| `deepMerge` | 变异第一个参数；`Date`/`RegExp` 被当普通对象合并导致损坏 | 返回新对象；增加 `isPlainObject` 判断 |
| `set` | 数字类型 key 未处理（`get` 处理了），传入 `set(o, 0, v)` 会抛异常 | 对齐 `get` 的逻辑 |
| `pick`/`pickBy` | `obj` 为 null/undefined 时 `Object.entries` 抛异常 | 加 null 防护 |
| `intersection` | 传入非数组参数直接 TypeError | 校验输入类型 |
| `uniqByKey` | 数组元素为 null/undefined 时 `key in item` 抛异常 | 加元素类型检查 |
| `difference` | O(n×m) 性能 | 用 `Set` 优化 |
| `groupBy` | 每次 reduce 都 `{ ...res }`，O(n²) 浅拷贝 | 用可变累加器 |
| `flatten` | null 输入抛异常；`...spread` 导致 O(n²) | 加 null 防护；用 push |
| `random` | `max < min` 时结果错误 | 校验或自动交换 |
| `clamp` | `min > max` 时行为不确定 | 校验或自动交换 |
| `segment` | `count === 0` 时 `Array(0).reduce()` 抛 TypeError | 加边界检查 |

### 类型判断函数

| 函数 | 问题 | 建议 |
|------|------|------|
| `isArray` | `instanceof Array` 跨 iframe/realm 失败 | 用 `Array.isArray` |
| `isDate` | 同上 `instanceof` 问题 | 用 `Object.prototype.toString` |
| `isError` | 缺少 `AggregateError`；`instanceof` 跨 realm；返回 `boolean` 不是 `value is Error` | 补充错误类型；统一类型守卫 |
| `isWKWebview` | 普通 iOS Safari 也有 `window.webkit`，会误判 | 用更精确的 WebView 检测信号 |
| `isDesktop` | `navigator.platform` 已废弃，iPadOS 桌面模式误判 | 用 User-Agent Client Hints |
| `isReactValidElement` | 无 `Symbol` 环境下 React 用数字作 `$$typeof`，检测失败 | 同时检查 symbol 和 number |
| `isNumber` | `Infinity`/`-Infinity` 通过检测 | 视需求加 `isFinite` |
| `isPromiseLike` | 类型守卫 `value is Promise<any>`，但实际只检测 thenable | 改为 `value is PromiseLike<any>` |
| `isNaN` | 类型守卫 `value is typeof NaN` 窄化为 `number` | 用 `Number.isNaN` 或修正返回类型 |

### 异步/工具函数

| 函数 | 问题 | 建议 |
|------|------|------|
| `memoize` | 无上限缓存，Map 无限增长 | 加 maxSize 或 LRU |
| `copy` | `execCommand('copy')` 已废弃；sync/async 返回类型不一致 | 统一用 Clipboard API |
| `source` | 无 `document` 检查（SSR 抛异常）；并发加载同 URL 存在竞态 | 加环境检查和去重 |
| `catchPromise` | 函数作为参数时 `this` 绑定可能错误 | 文档化或修正 `this` 传递 |

### 类/模块

| 模块 | 问题 | 建议 |
|------|------|------|
| `ScrollListener` | `destroy` 后未取消 pending 的 rAF | 保存 rAF ID 并在 destroy 中取消 |
| `I18n` | `instances` 无限增长；`applyLanguage` 未检查 `config.types` | 加 destroy/unregister 方法 |
| `EventBus.off` | `listener` 为 undefined 时静默清空整个事件 | 文档化或拆分 API |
| `CombJudge` | 类名拼写 `CombJubge` vs 导出名 `CombJudge` | 统一命名 |
| `easing` | 重复定义的函数名（先写后覆盖）；`flicker` 用了 `Math.random()` | 清理重复定义 |
| `Tween` | 状态属性拼写 `stoped` | 改为 `stopped` |
| `storage` | 模块加载时直接访问 `localStorage`，SSR 环境报错 | 延迟访问 |

---

## 🔵 Info — 非紧急但可改进

- `globalThis`: `Function('return this')()` 在严格 CSP 下被拦截
- `delay`: `Infinity` 导致 Promise 永不 resolve
- `curry`: 依赖 `fn.length`，有默认参数或 rest 参数时异常
- 多处类型使用 `any` / `Function`，缺少泛型约束
- 类型守卫不统一：部分用 `value is T`，部分只返回 `boolean`
- UA 检测与 platform 检测混用，结果可能矛盾

---

## 跨模块一致性问题

1. **类型守卫**：`isString`/`isArray` 用 `value is T`，但 `isObject`/`isError`/`isReactValidElement` 只返回 `boolean`
2. **`instanceof` vs 静态方法**：`isArray` 应用 `Array.isArray`
3. **UA vs platform**：`isAndroid`/`isIOS` 用 UA，`isDesktop` 用 `navigator.platform`（已废弃）
4. **null 防护**：`pick`/`pickBy`/`flatten`/`intersection`/`uniqByKey` 缺失 null 检查
5. **命名一致性**：`CombJubge` vs `CombJudge`，`stoped` vs `stopped`

---

## 修复状态

| 优先级 | 内容 | 状态 |
|--------|------|------|
| **P0** | FrameProcess `isAvailable`、url `=` 截断、`getFormatter` 数字 0 | ✅ 已修复 |
| **P0** | `safeStringify` 共享引用、`debounce` 返回值 | ✅ 已修复 |
| **P0** | `lock` 参数忽略 | ⏳ 待确认设计意图 |
| **P1** | `deepMerge` 变异、`isArray` 跨 realm、`pick`/`flatten` null 防护 | 待处理 |
| **P2** | 性能优化（`groupBy`/`difference` 用 Set）、类型守卫统一 | 待处理 |
| **P3** | 命名修正、文档补充、废弃 API 替换 | 待处理 |
