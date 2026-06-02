# throttle

节流：在 `wait` 毫秒内至多立即执行一次，并保证停止触发后最后一次仍会执行。

```ts
import { throttle } from '@fexd/tools'
```

## 适用场景

- scroll 事件，持续触发但限制计算频率
- mousemove / drag 事件，实时但限频
- resize 事件，调整过程中也需要更新布局
- 任何"持续触发但限制频率"的场景

## 不适用场景

- 只需停止触发后再执行 → 用 `debounce`
- 需要 cancel 方法 → 本库的 throttle 不提供 cancel
- 需要精确控制 leading/trailing → 本库的 throttle 固定 leading + trailing

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
- 内部借助 `debounce` 保证尾调用不丢失
- **无 `cancel` 方法**；需取消请自行移除监听器或包装新函数
- 不要假设与 lodash throttle 行为一致

## 相关函数

- `debounce` — 防抖，停止触发后才执行
