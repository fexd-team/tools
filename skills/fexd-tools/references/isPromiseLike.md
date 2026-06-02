# isPromiseLike

通过 duck typing 判断值是否为 thenable（含 `then` 方法）。

```ts
import { isPromiseLike } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 Promise-like 对象（有 then 方法）
- 异步流程中安全判断

## 不适用场景

- 需要判断函数 → 用 isFunction
- 需要判断对象 → 用 isObject
- Promise-like 只检查 then 方法，不能保证完整 Promise 行为

## 签名

```ts
isPromiseLike(value: any): value is Promise<any>
```

## 用法

```ts
isPromiseLike(Promise.resolve(1)) // true
isPromiseLike({ then: () => {} }) // true

isPromiseLike(null) // false
isPromiseLike({}) // false
isPromiseLike({ then: 'x' }) // false
```

## 注意事项

- 要求 `isExist(value)` 且 `isFunction(value.then)`
- 类型守卫为 `Promise<any>`，非原生 Promise 也可能为 true
- 不验证 `then` 调用是否符合 Promises/A+ 规范

## 相关函数

isFunction, isObject
