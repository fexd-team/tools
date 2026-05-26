# isPromiseLike

判断值是否为 Promise-like 对象（具有 `.then` 方法）。

## 类型签名

```ts
isPromiseLike(value: any): value is Promise<any>
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值存在且 `.then` 属性为函数时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isPromiseLike } from '@fexd/tools'

isPromiseLike(Promise.resolve(1))  // => true
isPromiseLike({ then: () => {} })  // => true
isPromiseLike(123)                 // => false
isPromiseLike(null)                // => false
isPromiseLike({})                  // => false
```

## 注意

- 采用 duck typing：只要值存在且 `.then` 为函数即返回 `true`，**不**验证是否为原生 `Promise`。
- 任意对象手动挂载 `then` 方法也会匹配，可能与 thenable 混用导致意外行为。
- `null`、`undefined` 经 `isExist` 过滤后直接返回 `false`。

## 另见

- [`catchPromise`](../函数/catchPromise) — 安全包装 Promise
- [`enhancePromise`](../函数/enhancePromise) — 增强 Promise