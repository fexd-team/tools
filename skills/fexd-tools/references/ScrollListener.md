# ScrollListener

滚动容器监听器，支持 rAF 节流、距离事件与触底回调。

```ts
import { ScrollListener } from '@fexd/tools'
```

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
