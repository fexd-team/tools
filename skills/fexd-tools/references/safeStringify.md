# safeStringify

安全 JSON 序列化，跳过 React 元素并标记循环引用。

```ts
import { safeStringify } from '@fexd/tools'
```

## 适用场景

- 序列化包含循环引用的对象，避免 `JSON.stringify` 抛错
- 序列化包含 React 元素的状态对象，自动跳过不可序列化部分
- 在 `storage.set` 等持久化场景中安全地转为 JSON 字符串
- 调试时需要将复杂对象转为可读字符串

## 不适用场景

- 需要完整还原对象结构的反序列化场景（循环引用标记为字符串，不可逆）
- 需要自定义序列化行为的场景（如 replacer 函数），应直接使用 `JSON.stringify`
- 对性能敏感的大规模序列化（每次调用都重新构建缓存）

## 签名

```ts
const safeStringify = (object: any): string
```

## 用法

```ts
const state = { user: { name: 'a' }, ui: <span /> }
state.user.ref = state.user // 循环

safeStringify(state)
// '{"user":{"name":"a","ref":"[Circular]"}}'  // ui 被省略
```

## 注意事项

- React 元素（`isReactElementLike`）序列化为 `undefined`，最终从 JSON 中剔除
- 循环引用替换为字符串 `'[Circular]'`
- 被 `storage.set` 内部用于持久化，避免 `JSON.stringify` 抛错

## 相关函数

- `qs` — QueryString 序列化，处理 URL 参数场景
- `JSON.stringify` — 原生 JSON 序列化，不处理循环引用和 React 元素
