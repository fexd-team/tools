# nextTick

在下一个微任务中执行回调，等价于 `Promise.resolve().then(func)`。

```ts
import { nextTick } from '@fexd/tools'
```

## 签名

```ts
const nextTick = (func: (value?: any) => any): Promise<any>
```

## 用法

```ts
let updated = false
updateState()
nextTick(() => {
  // DOM / 派生状态已更新后再读取
  console.log(updated)
})

// 等待微任务完成
await nextTick(() => {
  measureLayout()
})
```

## 注意事项

- 在当前宏任务同步代码执行完毕后、下一微任务阶段运行
- 返回值即 `func` 的返回值（经 Promise 链传递）
- 若 `func` 抛出异常，返回的 Promise 会 reject
- 需要宏任务延后（如浏览器绘制后）请用 `requestAnimationFrame` 或 `setTimeout`
