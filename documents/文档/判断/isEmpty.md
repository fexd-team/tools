# isEmpty

判断值是否为"空"。支持多种类型的空值判断。

## 类型签名

```ts
isEmpty(value: any): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为"空"时返回 `true`。

## 空值规则

| 类型 | 空的条件 |
|------|----------|
| `null` / `undefined` | 始终为空 |
| 字符串 | `length === 0` |
| 数组 | `length === 0` |
| Map / Set | `size === 0` |
| 对象 | 无自身可枚举属性 |
| 其他（number/boolean/function 等） | 始终为空 |

## 示例

```ts
import { isEmpty } from '@fexd/tools'

// null / undefined
isEmpty(null)         // => true
isEmpty(undefined)    // => true

// 字符串
isEmpty('')           // => true
isEmpty(' ')          // => false (有空格字符)
isEmpty('hello')      // => false

// 数组
isEmpty([])           // => true
isEmpty([1])          // => false

// 对象
isEmpty({})           // => true
isEmpty({ a: 1 })    // => false

// Map / Set
isEmpty(new Map())    // => true
isEmpty(new Set([1])) // => false

// 其他类型
isEmpty(0)            // => true (number 不是集合类型)
isEmpty(false)        // => true (boolean 不是集合类型)
```

## 注意

- 只关注"是否有内容"，不做深度检查。`[undefined]` 被视为非空（有一个元素）。
- 字符串 `' '`（空格）**不为空**，如需 trim 后判断请手动处理。
- `number`、`boolean`、`function` 等非集合类型一律返回 `true`——它们不是"容器"。
- 继承属性不计入对象判断（使用 `Object.keys` 只检查自身可枚举属性）。

## 另见

- [`isNil`](./isNil) — 仅判断 null | undefined
- [`isExist`](./isExist) — 判断是否非 null 且非 undefined
