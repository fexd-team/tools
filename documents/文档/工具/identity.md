# identity

恒等函数，原样返回传入的值。

## 类型签名

```ts
const identity = <T>(value: T): T
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `T` | 是 | — | 任意值 |

## 返回值

`T` — 原样返回传入的值。

## 示例

```ts
import { identity } from '@fexd/tools'

identity(42)       // => 42
identity('hello')  // => 'hello'
identity({ a: 1 }) // => { a: 1 }

// 常用于函数式编程中作为默认转换函数
const transform = (arr, fn = identity) => arr.map(fn)
transform([1, 2, 3])  // => [1, 2, 3]
```

## 另见

- [`run`](./run) — 安全调用函数或取值
- [`value`](./value) — 返回第一个非 undefined 的值
