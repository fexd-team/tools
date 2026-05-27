# isString

判断值是否为字符串类型。

```ts
import { isString } from '@fexd/tools'
```

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
