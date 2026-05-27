# isPromiseLike

通过 duck typing 判断值是否为 thenable（含 `then` 方法）。

```ts
import { isPromiseLike } from '@fexd/tools'
```

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
