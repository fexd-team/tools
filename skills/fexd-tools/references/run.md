# run

按路径安全调用对象上的函数或取值，自动绑定 `this` 上下文。

```ts
import { run } from '@fexd/tools'
```

## 签名

```ts
const run = <T = any>(obj: any, keys?: KType, ...args: any[]): T

type KType = string | (string | number)[]
```

## 用法

```ts
const store = {
  state: { count: 0 },
  actions: {
    increment(n: number) {
      this.state.count += n
    },
  },
}

run(store, 'actions.increment', 1) // count 变为 1
run(store, ['state', 'count']) // => 1

// obj 为函数时直接调用（catchPromise 等内部用法）
await run(() => fetch('/api'))
await run(maybeFnOrValue, undefined, arg1)
```

## 注意事项

- `keys` 为字符串时按 `.` 分割；省略 `keys` 时把 `obj` 当函数执行
- 路径末端非函数则返回该值；`this` 绑定为路径父级对象
- 支持同步函数、async 函数及 Promise 返回值
