# source

动态加载外部 JS/CSS 资源，自动去重并支持提取全局变量。

```ts
import { source } from '@fexd/tools'
```

## 签名

```ts
const source: {
  js: (src: string, externals?: string | string[]) => Promise<any>
  css: (href: string) => void
}
```

## 用法

```ts
// 加载 JS 并提取全局变量
const React = await source.js(
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'React'
)

// 提取多个全局变量，返回数组
const libs = await source.js(cdnUrl, ['_', 'lodash'])

// 加载 CSS（同步插入 link，无 Promise）
source.css('https://cdn.example.com/style.css')
```

## 注意事项

- 同一 `src`/`href` 只加载一次；重复调用 `js` 仍 resolve 已有 externals 并 `console.warn`
- `externals` 从 `globalThis` 读取，缺失时输出警告
- 仅适用于浏览器环境（依赖 `document`）
- 实现位于 `src/source/`，默认导出 `{ js, css }`
