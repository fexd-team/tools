# safeStringify

安全 JSON 序列化，跳过 React 元素并标记循环引用。

```ts
import { safeStringify } from '@fexd/tools'
```

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
