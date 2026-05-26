# isNull

判断值是否为 `null`。

## 类型签名

```ts
isNull(value: any): value is null
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值严格等于 `null` 时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `null`。

## 示例

```ts
import { isNull } from '@fexd/tools'

isNull(null)       // => true
isNull(undefined)  // => false
isNull(0)          // => false
isNull('')         // => false
```

## 注意

- 使用严格相等（`=== null`），`undefined` 返回 `false`，两者不可互换。
- 与 `isExist` 互补：`isExist(null)` 为 `false`，但 `0`、`''`、`false` 等 falsy 值仍为 `true`。
- 不要与 `== null`（同时匹配 `null` 和 `undefined`）混淆。

## 另见

- [`isUndefined`](./isUndefined) — 判断是否为 `undefined`
- [`isExist`](./isExist) — 判断是否非 `null` 且非 `undefined`