# isAndroid

判断当前设备是否为 Android 环境。

## 类型签名

```ts
isAndroid(): boolean
```

## 参数

无

## 返回值

`boolean` — 当 `navigator.userAgent` 包含 `Android` 时返回 `true`。

## 示例

```ts
import { isAndroid } from '@fexd/tools'

// 在 Android 设备中
isAndroid() // => true

// 在其他设备中
isAndroid() // => false
```

## 注意

- 依赖 `navigator.userAgent`，SSR 或无 `navigator` 的环境会返回 `false`。
- User-Agent 可被客户端或浏览器扩展修改，**不应**作为唯一的安全判断依据。
- 与 `isMobile`、`isDesktop` 组合使用更准确；单独调用无法区分平板与手机形态。

## 另见

- [`isMobile`](./isMobile) — 判断是否为移动端
- [`isIOS`](./isIOS) — 判断是否为 iOS
- [`isDesktop`](./isDesktop) — 判断是否为桌面端
