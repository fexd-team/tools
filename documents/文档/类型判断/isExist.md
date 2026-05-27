# isExist

判断值是否存在（非 `null` 且非 `undefined`）。

## 类型签名

```ts
isExist(value: any): boolean
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值不是 `null` 也不是 `undefined` 时返回 `true`，否则返回 `false`。

## 示例

```ts
import { isExist } from '@fexd/tools'

isExist(0) // => true
isExist('') // => true
isExist(false) // => true（falsy 值也是"存在"的）
isExist(null) // => false
isExist(undefined) // => false
```

## 注意

- 与 `!!value` 不同，`isExist` 只排除 `null` 和 `undefined`，**不会**排除 `0`、`''`、`false` 等 falsy 值。
- 常用于 `pickBy` 的默认谓词，过滤掉对象中值为 `null` 或 `undefined` 的属性。

## 另见

- [`isNull`](./isNull) — 判断是否为 `null`
- [`isUndefined`](./isUndefined) — 判断是否为 `undefined`
