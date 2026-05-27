# throttle

节流：在 `wait` 毫秒内至多立即执行一次，并保证停止触发后最后一次仍会执行。

```ts
import { throttle } from '@fexd/tools'
```

## 签名

```ts
const throttle = <T extends AnyFunction>(
  func: T,
  wait?: number
): T
```

## 用法

```ts
const onScroll = throttle(() => {
  updateScrollPosition()
}, 100)

window.addEventListener('scroll', onScroll)
```

## 注意事项

- 默认 `wait` 为 **16** ms
- 首次进入窗口立即执行，窗口内后续调用被忽略
- 内部借助 `debounce` 保证**尾调用**不丢失（如滚动停止后再执行一次）
- 无 `cancel` 方法；需取消请自行移除监听器或包装新函数
