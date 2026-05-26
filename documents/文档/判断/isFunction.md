# isFunction

判断值是否为函数。

## 类型签名

```ts
isFunction(value: any): value is Function
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为函数时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `Function`。

## 示例

```ts
import { isFunction } from '@fexd/tools'

isFunction(() => {})          // => true
isFunction(function() {})     // => true
isFunction(123)               // => false
isFunction('hello')           // => false
isFunction(null)              // => false
```

## 注意

- 基于 `typeof value === 'function'`，箭头函数、async 函数、Generator 均返回 `true`。
- ES6 `class` 声明在运行时也是函数，会返回 `true`。
- 与 `isPromiseLike` 不同：后者检查 `.then` 方法，函数本身除非挂载了 `then` 否则不会匹配。

## 另见

- [`isObject`](./isObject) — 判断是否为纯对象
- [`isPromiseLike`](./isPromiseLike) — 判断是否为 Promise-like 对象