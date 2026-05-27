# debounce

防抖：连续触发时仅在上次调用后等待 `wait` 毫秒再执行一次。

```ts
import { debounce } from '@fexd/tools'
```

## 签名

```ts
type AnyFunction = (...args: any[]) => any

const debounce = <T extends AnyFunction>(
  func: T,
  wait?: number
): T & { cancel: () => void }
```

## 用法

```ts
const onSearch = debounce((keyword: string) => {
  fetch(`/api/search?q=${keyword}`)
}, 300)

input.addEventListener('input', (e) => onSearch(e.target.value))

// 组件卸载时取消待执行的调用
onSearch.cancel()
```

## 注意事项

- 默认 `wait` 为 **16** ms
- 每次调用会重置计时器；返回值为内部 `setTimeout` 的 id
- `cancel()` 清除待执行定时器，避免卸载后仍触发
- 不提供 leading 执行，仅 trailing 触发
