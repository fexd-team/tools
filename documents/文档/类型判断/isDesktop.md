# isDesktop

判断当前设备是否为桌面端（PC）。

## 类型签名

```ts
isDesktop(): boolean
```

## 参数

无

## 返回值

`boolean` — 当 `navigator.platform` 匹配 `Win32`、`Win64`、`MacIntel` 或 `Linux x86_64` 时返回 `true`。

## 示例

```ts
import { isDesktop } from '@fexd/tools'

// 在 Windows/Mac/Linux 桌面浏览器中
isDesktop() // => true

// 在移动设备浏览器中
isDesktop() // => false
```

## 注意

- 依赖 `navigator.platform`，SSR 或无 `navigator` 的环境会返回 `false`。
- 较新 iPad 在「请求桌面网站」模式下可能上报 `MacIntel`，导致 `isDesktop()` 为 `true` 而 `isIOS()` 也为 `true`。
- 仅匹配 `Win32`、`Win64`、`MacIntel`、`Linux x86_64`，其他平台（如 ARM Linux）可能返回 `false`。

## 另见

- [`isMobile`](./isMobile) — 判断是否为移动端
- [`isAndroid`](./isAndroid) — 判断是否为 Android
- [`isIOS`](./isIOS) — 判断是否为 iOS
