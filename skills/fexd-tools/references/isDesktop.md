# isDesktop

判断当前是否为桌面平台（排除 iPadOS 伪 Mac）。

```ts
import { isDesktop } from '@fexd/tools'
```

## 适用场景

- 判断当前是否为桌面端（排除 iPadOS）
- 桌面专属功能开关

## 不适用场景

- SSR/Node 环境
- 只需判断是否移动端 → 用 isMobile

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

## 相关函数

isMobile, isIOS
