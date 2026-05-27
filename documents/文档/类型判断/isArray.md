# isArray

判断值是否为数组。

## 类型签名

```ts
isArray(value: any): value is Array<any>
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为数组时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `Array<any>`。

## 示例

```ts
import { isArray } from '@fexd/tools'

isArray([1, 2, 3]) // => true
isArray([]) // => true
isArray({}) // => false
isArray(null) // => false
isArray('hello') // => false
```

## 注意

- 基于 `instanceof Array` 判断，跨 iframe / realm 的数组可能返回 `false`。
- 类数组对象（如 `arguments`、`NodeList`）**不是**数组，会返回 `false`。
- `TypedArray`（如 `Uint8Array`）同样不是 `Array` 实例，需单独处理。

## 另见

- [`isObject`](./isObject) — 判断是否为纯对象
