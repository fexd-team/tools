# isNil

判断值是否为 `null` 或 `undefined`。

## 类型签名

```ts
isNil(value: any): value is null | undefined
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为 `null` 或 `undefined` 时返回 `true`。具有 TypeScript 类型守卫。

## 示例

```ts
import { isNil } from '@fexd/tools'

isNil(null) // => true
isNil(undefined) // => true
isNil(void 0) // => true

isNil(0) // => false
isNil('') // => false
isNil(false) // => false
isNil(NaN) // => false
isNil([]) // => false
isNil({}) // => false
```

## 注意

- 等价于 `value === null || value === undefined`，即 `value == null` 的严格实现。
- 与 `isExist` 互为反义：`isNil(x) === !isExist(x)`。
- `0`、`''`、`false`、`NaN` 等 falsy 值**不是** nil，返回 `false`。

## 另见

- [`isExist`](./isExist) — 判断是否非 null 且非 undefined（isNil 的反义）
- [`isNull`](./isNull) — 仅判断 null
- [`isUndefined`](./isUndefined) — 仅判断 undefined
