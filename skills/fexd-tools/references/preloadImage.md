# preloadImage

预加载图片 URL 列表，触发浏览器缓存，无返回值。

```ts
import { preloadImage } from '@fexd/tools'
```

## 签名

```ts
const preloadImage = (srcList: string[]): void
```

## 用法

```ts
preloadImage(['/assets/banner.jpg', '/assets/icon-sprite.png'])

// 路由切换前预热
preloadImage(nextRoute.meta.preloadImages ?? [])
```

## 注意事项

- 创建 `Image` 并设置 `src`，不等待加载完成
- 无加载成功/失败回调，仅发起请求
- 需在浏览器环境使用
