# isReactElementLike

通过检测 `$$typeof` 是否为 Symbol，判断值是否为 React-like 类型（Element、Memo、ForwardRef、Lazy、Portal 等）。

```ts
import { isReactElementLike } from '@fexd/tools'
```

## 签名

```ts
isReactElementLike(object: any): boolean
```

## 用法

```ts
import React from 'react'

isReactElementLike(<div />) // true
isReactElementLike(React.createElement('p')) // true
isReactElementLike(React.memo(() => null)) // true
isReactElementLike(React.forwardRef(() => null)) // true

isReactElementLike({}) // false
isReactElementLike(null) // false
isReactElementLike({ $$typeof: 'not-symbol' }) // false
```

## 注意事项

- 条件：`typeof object === 'object' && object !== null && typeof object.$$typeof === 'symbol'`
- 兼容 React 14~19 全版本（包括 React 19 新 JSX transform 产生的元素）
- 比 `React.isValidElement` 范围更广：检测所有 React 内部类型，不仅限于 Element
- 被 `safeStringify` 和 `isPlainObject` 内部使用，避免序列化或误判 React 对象
