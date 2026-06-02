# debounce

防抖：连续触发时仅在上次调用后等待 `wait` 毫秒再执行一次。

```ts
import { debounce } from '@fexd/tools'
```

## 适用场景

- 搜索输入框，停止输入后再发请求
- resize 事件，窗口调整结束后再计算布局
- 表单校验，停止输入后再触发验证
- 任何"停止触发后才执行"的场景

## 不适用场景

- 需要在窗口开始时立即执行（leading）→ 本库的 debounce 不支持 leading
- 持续触发期间也需要定期执行 → 用 `throttle`
- 需要 flush 方法立即执行待处理的调用 → 本库的 debounce 不提供 flush

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

onSearch.cancel()
```

## 注意事项

- 默认 `wait` 为 **16** ms
- 每次调用会重置计时器；返回值为内部 `setTimeout` 的 id
- `cancel()` 清除待执行定时器，避免卸载后仍触发
- **仅 trailing 触发**，不提供 leading 执行
- **无 flush 方法**，不要假设与 lodash debounce 行为一致

## 相关函数

- `throttle` — 节流，窗口内至多执行一次，适合持续触发场景
- `memoize` — 缓存函数结果，与防抖无关
