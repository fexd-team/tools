# isUndefined

判断值是否为 undefined。

```ts
import { isUndefined } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 undefined
- 精确区分 null 和 undefined

## 不适用场景

- 只需判断是否为空值（null 或 undefined）→ 用 isNil（更简洁）
- 需要判断非空 → 用 isExist

## 签名

```ts
isUndefined(value: any): value is undefined
```

## 用法

```ts
isUndefined(undefined) // true
let x
isUndefined(x) // true

isUndefined(null) // false
isUndefined(void 0) // true
isUndefined(0) // false
```

## 注意事项

- `typeof value === 'undefined'`，安全用于未声明变量场景
- 带类型守卫；与 `isNull` 组合即 `isNil` / `!isExist`
- `void 0` 等价于 undefined

## 相关函数

- `isNil` — 判断值是否为 null 或 undefined
- `isNull` — 判断值是否为 null
