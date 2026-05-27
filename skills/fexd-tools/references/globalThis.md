# globalThis

跨环境全局对象引用，兼容浏览器、Worker 与 Node。

```ts
import { globalThis } from '@fexd/tools'
```

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
