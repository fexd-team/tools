# preloadImage

预加载图片列表，创建 `Image` 对象并设置 `src` 以触发浏览器下载。

## 类型签名

```ts
const preloadImage = (srcList: string[]): void
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `srcList` | `string[]` | 是 | — | 要预加载的图片 URL 列表 |

## 返回值

`void` — 触发即忘记（fire-and-forget），不返回加载状态。

## 示例

```ts
import { preloadImage } from '@fexd/tools'

// 预加载图片
preloadImage([
  '/images/hero.jpg',
  '/images/background.jpg',
  '/images/icon.svg',
])
```

## 注意

- 此函数不会等待图片加载完成，仅创建 `Image` 对象并设置 `src` 触发下载。
- 如需等待加载完成，请自行使用 `new Image()` 的 `onload` 事件。

## 另见

- [`FrameProcess`](./FrameProcess) — 帧任务调度器
- [`defaultFrameProcess`](./defaultFrameProcess) — 默认帧处理器