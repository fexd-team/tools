# isNull

判断值是否严格等于 null。

```ts
import { isNull } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 null
- 精确区分 null 和 undefined

## 不适用场景

- 只需判断是否为空值 → 用 isNil
- 需要判断非空 → 用 isExist

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

## 相关函数

- `isNil` — 判断值是否为 null 或 undefined
- `isUndefined` — 判断值是否为 undefined
