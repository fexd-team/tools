# preloadImage

预加载图片 URL 列表，触发浏览器缓存，无返回值。

```ts
import { preloadImage } from '@fexd/tools'
```

## 适用场景

- 路由切换或组件挂载前预热图片，减少首屏白屏时间
- 图片轮播/画廊组件提前加载后续图片
- 需要批量触发浏览器图片缓存而不关心加载结果时

## 不适用场景

- 浏览器专用，Node.js 环境不可用
- 需要等待图片加载完成并获取尺寸等元信息（应自行封装 Image onload）
- 需要处理加载失败或重试逻辑（preloadImage 不提供回调）

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

## 相关函数

- `file2base64` — 将文件对象转为 base64 Data URL，可与预加载配合使用
- `source` — 数据源请求工具
