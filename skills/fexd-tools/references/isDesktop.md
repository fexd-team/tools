# isDesktop

判断当前是否为桌面平台（排除 iPadOS 伪 Mac）。

```ts
import { isDesktop } from '@fexd/tools'
```

## 签名

```ts
isDesktop(): boolean
```

## 用法

```ts
if (isDesktop()) {
  // Win / Mac / Linux 等桌面逻辑
}
```

## 注意事项

- `navigator.platform` 匹配 Win32、Win64、MacIntel、Linux、FreeBSD、CrOS 等
- `MacIntel` 且 `maxTouchPoints > 1` 视为 iPad，返回 false
- 无参数；`isMobile` 为 `!isDesktop() && (isAndroid() || isIOS())`
