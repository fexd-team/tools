# run

按路径安全调用对象上的函数或取值，自动绑定 `this` 上下文。

```ts
import { run } from '@fexd/tools'
```

## 适用场景

- 按路径安全调用对象上的方法
- 需要自动绑定 `this` 为路径父级对象
- 不确定路径末端是函数还是值时安全取值/调用
- 对象可能为函数时直接执行

## 不适用场景

- 只需按路径取值不调用 → 用 `get`
- 多值回退链 → 用 `value`
- 路径在编码时已知且静态，且项目支持 ES2020+ 或有垫片 → 用可选链 `obj?.fn?.(arg)` 更简洁

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

run(store, 'actions.increment', 1)
run(store, ['state', 'count']) // => 1

await run(() => fetch('/api'))
await run(maybeFnOrValue, undefined, arg1)
```

## 注意事项

- `keys` 为字符串时按 `.` 分割；省略 `keys` 时把 `obj` 当函数执行
- 路径末端非函数则返回该值；`this` 绑定为路径父级对象
- 支持同步函数、async 函数及 Promise 返回值

## 相关函数

- `get` — 按路径安全取值，不调用函数
- `value` — 多值回退链，内部使用 run 处理每项
- `catchPromise` — 安全包装 Promise，内部使用 run 处理函数参数
