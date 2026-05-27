# source

动态加载外部 JS 和 CSS 资源，支持缓存和外部变量提取。

## 类型签名

```ts
const source: {
  js: (src: string, externals?: string | string[]) => Promise<any>
  css: (href: string) => void
}
```

## 对象属性

| 方法                         | 说明                                         |
| ---------------------------- | -------------------------------------------- |
| `source.js(src, externals?)` | 加载 JS 脚本，可选提取外部变量。返回 Promise |
| `source.css(href)`           | 加载 CSS 样式表                              |

## 参数（js）

| 参数        | 类型                 | 必填 | 默认值 | 说明                                     |
| ----------- | -------------------- | ---- | ------ | ---------------------------------------- |
| `src`       | `string`             | 是   | —      | JS 脚本 URL                              |
| `externals` | `string \| string[]` | 否   | —      | 脚本加载后要从 `globalThis` 提取的变量名 |

## 示例

```ts
import { source } from '@fexd/tools'

// 加载 JS 并提取全局变量
const React = await source.js(
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'React'
)
// React 即为加载的全局 React 对象

// 加载多个外部变量
const [lodash] = await source.js(
  'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js',
  ['_', 'lodash']
)

// 加载 CSS
source.css('https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css')
```

## 注意

- 同一脚本只会加载一次（基于 src 去重缓存），重复加载会返回缓存结果并输出警告。
- `externals` 用于从 `globalThis` 提取脚本挂载的全局变量。

## 另见

- [`url`](./url) — URL 参数处理
