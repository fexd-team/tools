# ScrollListener

滚动容器监听器，支持 rAF 节流、距离事件与触底回调。

```ts
import { ScrollListener } from '@fexd/tools'
```

## 适用场景

- 监听滚动容器实现触底加载更多
- 根据滚动距离触发 UI 变化（如吸顶、显示/隐藏元素）
- 需要自动 rAF 节流的高性能滚动监听

## 不适用场景

- SSR 环境，依赖浏览器 DOM API
- 需要精确像素级滚动事件（rAF 节流会丢失帧）
- 非 DOM 环境的虚拟滚动模拟

## 签名

```ts
interface DistanceEventType {
  distance: number | Function
  onGoingIn?: Function
  onGoningOut: Function
  dynamic?: boolean
}

interface ScrollListenerConfig {
  element: HTMLBaseElement
  scrollHandler?: Function
  getScrollDistance?: Function
  distanceToReachEnd?: number
  onEndReached?: Function
  distanceEvents?: DistanceEventType[]
  direction?: 'vertical' | 'horizontal'
}

class ScrollListener {
  constructor(config: ScrollListenerConfig)
  config: ScrollListenerConfig
  destroy: () => null
}
```

## 用法

```ts
const listener = new ScrollListener({
  element: document.getElementById('scroll')!,
  direction: 'vertical',
  distanceToReachEnd: 50,
  onEndReached: () => loadMore(),
  distanceEvents: [
    {
      distance: 200,
      onGoningOut: () => hideHeader(),
      onGoingIn: () => showHeader(),
    },
  ],
})
```

## 注意事项

- 默认用 `requestAnimationFrame` 包装 scroll 回调
- `distance` 可为函数，支持 `dynamic: true` 动态距离
- 无 `element` 时 `console.error` 并退出初始化
- `destroy` 当前返回 `null`，需自行移除监听时注意生命周期

## 相关函数

- `EventBus` — 事件发布/订阅总线，可用于滚动事件的进一步分发
- `throttle` — 节流函数，ScrollListener 内部默认使用 rAF 实现节流
