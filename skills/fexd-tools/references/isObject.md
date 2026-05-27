# isObject

判断值是否为对象（`typeof === 'object'`，排除数组和 null）。

```ts
import { isObject } from '@fexd/tools'
```

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
