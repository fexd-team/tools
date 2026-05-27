# nextTick

将函数调度到下一个微任务执行，等同于 `Promise.resolve().then(fn)`。

## 类型签名

```ts
const nextTick = <T>(func: (value: void) => T | PromiseLike<T>): Promise<T>
```

## 参数

| 参数   | 类型                                   | 必填 | 默认值 | 说明             |
| ------ | -------------------------------------- | ---- | ------ | ---------------- |
| `func` | `(value: void) => T \| PromiseLike<T>` | 是   | —      | 要延迟执行的函数 |

## 返回值

`Promise<T>` — resolve 值为 `func` 的返回值。内部等同于 `Promise.resolve().then(func)`。

## 示例

```ts
import { nextTick } from '@fexd/tools'

// 在下一个微任务中执行
await nextTick(() => {
  console.log('this runs in the next microtask')
})

// 获取返回值
const result = await nextTick(() => 'hello')
// result === 'hello'
```

## 另见

- [`delay`](./delay) — 延迟指定毫秒数
