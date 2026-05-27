# isWKWebview

判断当前是否在 iOS 的 WKWebView 环境中运行。

```ts
import { isWKWebview } from '@fexd/tools'
```

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
