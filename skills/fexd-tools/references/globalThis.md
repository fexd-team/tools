# globalThis

跨环境全局对象引用，兼容浏览器、Worker 与 Node。

```ts
import { globalThis } from '@fexd/tools'
```

## 适用场景

- 跨环境库/工具需要访问全局 API（setTimeout、localStorage 等），不确定运行在浏览器还是 Node
- 编写同时运行在主线程与 Web Worker 的代码，避免 `window is not defined` 错误
- SSR 场景中安全访问全局对象，避免直接使用 `window` 导致服务端报错
- 需要兼容低版本 Node（无 `globalThis` 原生支持）的通用模块

## 不适用场景

- 代码明确只运行在浏览器环境，直接使用 `window` 更清晰
- 需要访问特定环境的独有全局变量（如 Node 的 `process`），应直接引用对应环境变量
- TypeScript 项目已配置好 `lib` 且环境固定，使用原生 `globalThis` 即可

## 签名

```ts
const globalThis: typeof globalThis
```

## 用法

```ts
// 统一访问全局 API
globalThis.setTimeout(fn, 0)
globalThis.localStorage?.getItem('key')

// 替代各环境不同的 global / window / self
const loc = globalThis.location?.search
```

## 注意事项

- 导出值为初始化时解析的全局对象，非函数
- 优先 `window` → `self` → `global` → `Function('return this')()`
- Node 下若 `global` 非标准对象则回退到 polyfill 实现

## 相关函数

- `isMobile` — 基于 globalThis 检测运行环境是否为移动端
- `storage` — 基于 globalThis 访问 localStorage/sessionStorage 的跨环境存储封装
