# isIterable

判断值是否实现了 ES 迭代协议（具有 `Symbol.iterator`）。

## 类型签名

```ts
isIterable(value: any): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值具有 `Symbol.iterator` 方法时返回 `true`。

## 示例

```ts
import { isIterable } from '@fexd/tools'

// 内置可迭代类型
isIterable([1, 2, 3])    // => true
isIterable('hello')      // => true
isIterable(new Map())    // => true
isIterable(new Set())    // => true
isIterable(new Uint8Array())  // => true

// 自定义迭代器
const range = {
  [Symbol.iterator]() {
    let i = 0
    return { next: () => ({ value: i++, done: i > 3 }) }
  }
}
isIterable(range)        // => true

// 非可迭代
isIterable({})           // => false
isIterable(42)           // => false
isIterable(null)         // => false
isIterable(undefined)    // => false
```

## 注意

- 检查的是 ES 迭代协议（`Symbol.iterator`），即可被 `for...of` 遍历的值。
- 普通对象 `{}` **不是** iterable（不能 `for...of`），返回 `false`。
- 字符串是 iterable（每次迭代一个字符），返回 `true`。
- `null` 和 `undefined` 安全处理，返回 `false`。

## 另见

- [`isArray`](./isArray) — 判断是否为数组
- [`isObject`](./isObject) — 判断是否为对象
