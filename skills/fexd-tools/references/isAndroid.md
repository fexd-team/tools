# isAndroid

通过 UA 判断当前是否为 Android 环境。

```ts
import { isAndroid } from '@fexd/tools'
```

## 签名

```ts
isAndroid(): boolean
```

## 用法

```ts
// 浏览器环境，无参数
if (isAndroid()) {
  // Android 专属逻辑
}
```

## 注意事项

- 读取 `navigator.userAgent`，匹配 `/(Android)/i`
- 无参数，需在浏览器或含 navigator 的环境调用
- 与 `isIOS`、`isDesktop` 组合用于 `isMobile`
