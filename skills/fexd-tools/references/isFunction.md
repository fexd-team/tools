# isFunction

判断值是否为函数类型。

```ts
import { isFunction } from '@fexd/tools'
```

## 适用场景

- 判断值是否为函数
- 安全调用前类型检查

## 不适用场景

- 需要判断 Promise-like → 用 isPromiseLike
- 需要判断类构造函数 → 本函数不区分

## 签名

```ts
isFunction(value: any): value is Function
```

## 用法

```ts
isFunction(() => {}) // true
isFunction(Array.isArray) // true
isFunction(async () => {}) // true

isFunction('fn') // false
isFunction({}) // false
isFunction(null) // false
```

## 注意事项

- 使用 `typeof value === 'function'`，含箭头函数、async、class 构造器
- 带类型守卫，适合在联合类型中收窄后调用
- 不区分普通函数与原生内置函数

## 相关函数

- `isObject` — 判断值是否为对象
- `isPromiseLike` — 判断值是否为 Promise-like
