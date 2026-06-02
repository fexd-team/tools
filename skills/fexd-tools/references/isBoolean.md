# isBoolean

判断值是否为布尔类型。

```ts
import { isBoolean } from '@fexd/tools'
```

## 适用场景

- 判断值是否为布尔值
- 类型守卫收窄

## 不适用场景

- 需要判断 truthy/falsy → 直接用 Boolean() 或 !!
- 需要判断对象包装类型 → 本函数只判断原始值

## 签名

```ts
isBoolean(value: any): value is boolean
```

## 用法

```ts
isBoolean(true) // true
isBoolean(false) // true

isBoolean(1) // false
isBoolean('true') // false
isBoolean(null) // false
```

## 注意事项

- `typeof value === 'boolean'`，仅原始布尔值
- `Boolean(1)` 等包装对象为 false
- 带类型守卫

## 相关函数

- `isObject` — 判断值是否为对象
