# isPlainObject

判断值是否为普通对象（原型为 `Object.prototype` 或 `null`）。

```ts
import { isPlainObject } from '@fexd/tools'
```

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
