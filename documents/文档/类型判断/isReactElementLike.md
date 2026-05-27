# isReactElementLike

判断值是否为 React-like 类型（Element、Memo、ForwardRef、Lazy、Portal 等）。

## 类型签名

```ts
isReactElementLike(object: any): boolean
```

## 参数

| 参数     | 类型  | 必填 | 默认值 | 说明       |
| -------- | ----- | ---- | ------ | ---------- |
| `object` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值具有 React 内部 `$$typeof` Symbol 标记时返回 `true`。

## 示例

```ts
import { isReactElementLike } from '@fexd/tools'
import React from 'react'

isReactElementLike(<div />) // => true
isReactElementLike(React.createElement('span')) // => true
isReactElementLike(React.memo(() => null)) // => true
isReactElementLike(React.forwardRef(() => null)) // => true

isReactElementLike({ type: 'div' }) // => false（无 $$typeof）
isReactElementLike(null) // => false
isReactElementLike('hello') // => false
```

## 注意

- 通过 `typeof object.$$typeof === 'symbol'` 进行 duck-type 检测，不依赖 React 库。
- 比 `React.isValidElement` 范围更广：覆盖 Element、Memo、ForwardRef、Lazy、Portal、Context 等所有 React 内部类型。
- 兼容 React 14~19 全版本，包括 React 19 新 JSX transform（使用 `react.transitional.element`）。
- 在无 Symbol 支持的环境中（IE11），React 使用数字标记 `0xeac7`，此函数无法检测。
- 库内被 `safeStringify` 和 `isPlainObject` 使用，避免序列化或误判 React 对象。

## 另见

- [`safeStringify`](../format/safeStringify) — 序列化时跳过 React 类型
- [`isPlainObject`](./isPlainObject) — 排除 React 类型的普通对象判断
