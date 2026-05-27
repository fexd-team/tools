# isExist

判断值是否存在（非 null 且非 undefined）。

```ts
import { isExist } from '@fexd/tools'
```

## 签名

```ts
isExist(value: any): boolean
```

## 用法

```ts
isExist(0) // true
isExist('') // true
isExist(false) // true
isExist(NaN) // true

isExist(null) // false
isExist(undefined) // false
```

## 注意事项

- 等价于 `!isNil(value)` 或 `value != null` 的严格版（分别判断）
- `0`、`''`、`false`、`NaN` 均视为存在
- 无类型守卫；`isPromiseLike` 等用它排除空值
