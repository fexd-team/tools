# isWKWebview

判断当前环境是否为 iOS WKWebView。

## 类型签名

```ts
isWKWebview(): boolean
```

## 参数

无

## 返回值

`boolean` — 当环境为 iOS 且 `window.webkit` 对象存在时返回 `true`。

## 示例

```ts
import { isWKWebview } from '@fexd/tools'

// 在 iOS WKWebView 中
isWKWebview() // => true

// 在普通浏览器中
isWKWebview() // => false
```

## 注意

- 需同时满足 `isIOS()` 且存在 `window.webkit`，非 iOS 环境一律返回 `false`。
- 仅检测 `webkit` 对象是否存在，**不能**区分 WKWebView 与普通 Safari（部分 Safari 版本也可能暴露 `webkit`）。
- SSR 或无 `window` 的环境会返回 `false`。

## 另见

- [`isIOS`](./isIOS) — 判断是否为 iOS
- [`isMobile`](./isMobile) — 判断是否为移动端
