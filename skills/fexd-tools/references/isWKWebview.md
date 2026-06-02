# isWKWebview

判断当前是否在 iOS 的 WKWebView 环境中运行。

```ts
import { isWKWebview } from '@fexd/tools'
```

## 适用场景

- 判断当前是否运行在 WKWebView 中
- iOS 内嵌网页功能适配

## 不适用场景

- SSR/Node 环境
- 只需判断是否 iOS → 用 isIOS

## 签名

```ts
isWKWebview(): boolean
```

## 用法

```ts
if (isWKWebview()) {
  // WKWebView 桥接、webkit 相关逻辑
}
```

## 注意事项

- 条件：`isIOS() && isExist(get(root, 'webkit'))`
- 检测全局 `webkit` 对象是否存在
- 无参数；非 iOS 或 Safari 普通页可能为 false

## 相关函数

isIOS, isMobile
