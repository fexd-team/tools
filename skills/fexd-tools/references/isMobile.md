# isMobile

判断当前是否为移动设备（非桌面且为 Android 或 iOS）。

```ts
import { isMobile } from '@fexd/tools'
```

## 适用场景

- 判断当前是否为移动设备
- 响应式布局条件判断

## 不适用场景

- SSR/Node 环境（依赖 navigator）
- 需要区分具体平台 → 用 isAndroid/isIOS
- 需要 UI 响应式 → 用 CSS 媒体查询

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

## 相关函数

- `isAndroid` — 判断是否为 Android 设备
- `isIOS` — 判断是否为 iOS 设备
- `isDesktop` — 判断是否为桌面端
