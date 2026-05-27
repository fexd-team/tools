# globalThis

获取当前环境的全局对象引用。

## 类型签名

```ts
const globalThis: any
```

## 返回值

`any` — 当前环境的全局对象。浏览器中为 `window`，Node.js 中为 `global`，Web Worker 中为 `self`。

## 示例

```ts
import { globalThis } from '@fexd/tools'

// 在浏览器中
globalThis === window // => true

// 访问全局变量
globalThis.myGlobalVar = 'hello'
```

## 注意

- 按优先级检测：`window` → `self` → `global` → `Function('return this')()`。
- 会验证获取的全局对象是否包含 `Math` 和 `Array`，确保是有效的全局环境。

## 另见

- [`storage`](../format/storage) — 跨环境 localStorage / sessionStorage 封装
- [`createProxyGetter`](./createProxyGetter) — Proxy 代理属性访问
- [`value`](../async/value) — 统一取值与函数执行
