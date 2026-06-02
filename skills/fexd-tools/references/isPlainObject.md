# isPlainObject

判断值是否为普通对象（原型为 `Object.prototype` 或 `null`）。

```ts
import { isPlainObject } from '@fexd/tools'
```

## 适用场景

- 判断对象是否为纯粹普通对象（{} 或 Object.create(null)）
- 区分普通对象与类实例

## 不适用场景

- 需要判断任何对象类型（含 Date 等）→ 用 isObject
- 需要判断数组 → 用 isArray

## 签名

```ts
isPlainObject(value: any): boolean
```

## 用法

```ts
isPlainObject({}) // true
isPlainObject({ a: 1 }) // true
isPlainObject(Object.create(null)) // true

isPlainObject([]) // false
isPlainObject(null) // false
isPlainObject(new Date()) // false
```

## 注意事项

- 基于 `Object.getPrototypeOf`，排除数组与 React 元素（`$$typeof`）
- `Object.create(null)` 无原型，视为 plain object
- 类实例、DOM 节点等自定义原型对象返回 false

## 相关函数

- `isObject` — 判断值是否为对象（含 Date 等，排除数组和 null）
- `isArray` — 判断值是否为数组
