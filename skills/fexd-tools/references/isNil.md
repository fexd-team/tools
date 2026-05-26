# isNil

判断值是否为 null 或 undefined。

```ts
import { isNil } from '@fexd/tools'
```

## 签名

```ts
isNil(value: any): value is null | undefined
```

## 用法

```ts
isNil(null)       // true
isNil(undefined)  // true
isNil(void 0)     // true

isNil(0)          // false
isNil('')         // false
isNil(false)      // false
isNil(NaN)        // false
isNil([])         // false
isNil({})         // false
```

## 要点

- `isExist` 的反义：`isNil(x) === !isExist(x)`
- `0`、`''`、`false`、`NaN` 等 falsy 值不是 nil
- 等价于 `value == null`
