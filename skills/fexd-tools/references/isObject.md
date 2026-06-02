# isObject

判断值是否为对象（`typeof === 'object'`，排除数组和 null）。

```ts
import { isObject } from '@fexd/tools'
```

## 适用场景

- 判断值是否为普通对象（排除数组和 null）
- 类型守卫收窄为 object 类型
- 过滤对象类型参数

## 不适用场景

- 需要判断纯粹普通对象（原型为 Object.prototype）→ 用 isPlainObject
- 需要判断数组 → 用 isArray
- 需要判断 null → 用 isNull

## 签名

```ts
isObject(value: any): boolean
```

## 用法

```ts
isObject({ a: 1 }) // true
isObject({}) // true
isObject(new Date()) // true

isObject(null) // false
isObject([1, 2]) // false
isObject('hello') // false
```

## 注意事项

- 数组、null 返回 false；`new Date()` 等对象返回 true
- 无 TypeScript 类型收窄，需区分纯对象请用 `isPlainObject`
- `typeof null === 'object'`，本函数通过 `isNull` 排除

## 相关函数

- `isPlainObject` — 判断纯粹普通对象（原型为 Object.prototype）
- `isArray` — 判断值是否为数组
- `isNil` — 判断值是否为 null 或 undefined
