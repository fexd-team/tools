# isMobile

判断当前设备是否为移动端。

## 类型签名

```ts
isMobile(): boolean
```

## 参数

无

## 返回值

`boolean` — 当设备为移动端（非桌面端且为 Android 或 iOS）时返回 `true`。

## 示例

```ts
import { isMobile } from '@fexd/tools'

// 在移动端浏览器中
isMobile() // => true

// 在桌面端浏览器中
isMobile() // => false
```

## 注意

- 此函数在 SSR 环境下可能返回 `false`（依赖 `navigator.userAgent` 和 `navigator.platform`）。

## 另见

- [`isAndroid`](./isAndroid) — 判断是否为 Android
- [`isIOS`](./isIOS) — 判断是否为 iOS
- [`isDesktop`](./isDesktop) — 判断是否为桌面端
- [`isWKWebview`](./isWKWebview) — 判断是否为 WKWebView
