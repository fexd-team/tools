# isUndefined

判断值是否为 undefined。

```ts
import { isUndefined } from '@fexd/tools'
```

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
