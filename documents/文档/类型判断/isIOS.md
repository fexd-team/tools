# isIOS

判断当前设备是否为 iOS 环境。

## 类型签名

```ts
isIOS(): boolean
```

## 参数

无

## 返回值

`boolean` — 当 `navigator.userAgent` 包含 `iPhone`、`iPad`、`iPod` 或 `iOS` 时返回 `true`。

## 示例

```ts
import { isIOS } from '@fexd/tools'

// 在 iOS 设备中
isIOS() // => true

// 在其他设备中
isIOS() // => false
```

## 注意

- 依赖 `navigator.userAgent`，SSR 或无 `navigator` 的环境会返回 `false`。
- 较新 iPad 在桌面模式下 User-Agent 可能不含 `iPad`，导致返回 `false`；可结合 `isWKWebview` 或触控检测辅助判断。
- User-Agent 可被修改，**不应**作为唯一的安全判断依据。

## 另见

- [`isMobile`](./isMobile) — 判断是否为移动端
- [`isAndroid`](./isAndroid) — 判断是否为 Android
- [`isWKWebview`](./isWKWebview) — 判断是否为 WKWebView
