# isIterable

判断值是否实现了 ES 迭代协议（具有 `Symbol.iterator`）。

```ts
import { isIterable } from '@fexd/tools'
```

## 签名

```ts
isIterable(value: any): boolean
```

## 用法

```ts
// 内置可迭代类型
isIterable([1, 2, 3])         // true
isIterable('hello')           // true
isIterable(new Map())         // true
isIterable(new Set())         // true
isIterable(new Uint8Array())  // true

// 自定义迭代器
const range = {
  [Symbol.iterator]() {
    let i = 0
    return { next: () => ({ value: i++, done: i > 3 }) }
  }
}
isIterable(range)  // true

// 非可迭代
isIterable({})          // false (普通对象没有 Symbol.iterator)
isIterable(42)          // false
isIterable(null)        // false
isIterable(undefined)   // false
```

## 要点

- 检查 ES 迭代协议（`Symbol.iterator`），即可被 `for...of` 遍历的值
- 普通对象 `{}` 不是 iterable，返回 false
- 字符串是 iterable（每次迭代一个字符）
- null/undefined 安全处理，不会抛错
- 适用于判断值是否能传入 `Array.from()`、展开运算符 `[...value]` 等场景
