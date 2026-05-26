# isEmpty

判断值是否为"空"。支持多种类型。

```ts
import { isEmpty } from '@fexd/tools'
```

## 签名

```ts
isEmpty(value: any): boolean
```

## 空值规则

| 类型 | 空的条件 |
|------|----------|
| null / undefined | 始终为空 |
| 字符串 | `length === 0` |
| 数组 | `length === 0` |
| Map / Set | `size === 0` |
| 对象 | 无自身可枚举属性 |
| 其他（number/boolean/function） | 始终为空 |

## 用法

```ts
isEmpty(null)          // true
isEmpty(undefined)     // true
isEmpty('')            // true
isEmpty([])            // true
isEmpty({})            // true
isEmpty(new Map())     // true
isEmpty(new Set())     // true

isEmpty(' ')           // false (有字符)
isEmpty([1])           // false
isEmpty({ a: 1 })     // false
isEmpty(new Set([1]))  // false

isEmpty(0)             // true (number 非容器)
isEmpty(false)         // true (boolean 非容器)
```

## 要点

- 只检查"是否有内容"，不做深度检查
- 字符串 `' '` 不为空（有字符），需要 trim 请手动处理
- number/boolean/function 不是容器类型，一律返回 true
- 仅检查 `Object.keys`（自身可枚举属性）
