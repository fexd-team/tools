# isMobile

判断当前是否为移动设备（非桌面且为 Android 或 iOS）。

```ts
import { isMobile } from '@fexd/tools'
```

## 签名

```ts
isMobile(): boolean
```

## 用法

```ts
if (isMobile()) {
  // 移动端通用逻辑
}
```

## 注意事项

- 实现：`!isDesktop() && (isAndroid() || isIOS())`
- 基于 UA/platform，无参数调用
- 其他移动系统（如纯 Harmony）可能为 false
