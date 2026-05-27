# isNull

判断值是否严格等于 null。

```ts
import { isNull } from '@fexd/tools'
```

## 签名

```ts
isNull(value: any): value is null
```

## 用法

```ts
isNull(null) // true

isNull(undefined) // false
isNull(0) // false
isNull('') // false
```

## 注意事项

- 使用 `value === null`，不用 `==` 宽松相等
- 带类型守卫；`undefined` 为 false
- `isObject` 内部用其排除 null
