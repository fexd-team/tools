# isIOS

判断当前是否为 iOS 环境（含 iPadOS 桌面模式）。

```ts
import { isIOS } from '@fexd/tools'
```

## 适用场景

- 判断当前是否为 iOS 设备（含 iPadOS 桌面模式）
- iOS 专属功能适配

## 不适用场景

- SSR/Node 环境
- 只需判断是否移动端 → 用 isMobile
- 需要判断 WKWebView → 用 isWKWebview

## 签名

```ts
isIOS(): boolean
```

## 用法

```ts
if (isIOS()) {
  // iPhone / iPad / iPod 逻辑
}
```

## 注意事项

- UA 匹配 `/(iPhone|iPad|iPod|iOS)/i`
- iPadOS 13+ 桌面模式：`platform === 'MacIntel' && maxTouchPoints > 1`
- 无参数；`isDesktop` 对 MacIntel 做相反排除以区分真 Mac

## 相关函数

isMobile, isAndroid, isWKWebview
