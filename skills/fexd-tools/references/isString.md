# isString

判断值是否为字符串类型。

```ts
import { isString } from '@fexd/tools'
```

## 适用场景

- 判断值是否为字符串
- 类型守卫收窄

## 不适用场景

- 需要判断数字字符串 → 用 isNumberString
- 需要判断空字符串 → 用 isEmpty

## 签名

```ts
isString(value: any): value is string
```

## 用法

```ts
isString('hello') // true
isString('') // true
isString(String(1)) // true

isString(123) // false
isString(null) // false
isString(new String('a')) // false（包装对象非 string）
```

## 注意事项

- `typeof` 判断，原始字符串为 true，`new String()` 为 false
- 带类型守卫，常用于 `isNumberString` 等前置校验
- 空字符串 `''` 仍为 true

## 相关函数

- `isNumberString` — 判断值是否为数字字符串
- `isNumber` — 判断值是否为数字
