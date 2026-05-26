# isFinite

判断值是否为有限数字（排除 NaN、Infinity、-Infinity）。

## 类型签名

```ts
isFinite(value: any): value is number
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为有限数字时返回 `true`。具有 TypeScript 类型守卫。

## 示例

```ts
import { isFinite } from '@fexd/tools'

isFinite(0)         // => true
isFinite(1.5)       // => true
isFinite(-999)      // => true

isFinite(Infinity)  // => false
isFinite(-Infinity) // => false
isFinite(NaN)       // => false
isFinite('123')     // => false (不做类型转换)
isFinite(null)      // => false
isFinite(true)      // => false
```

## 注意

- 等价于 `typeof value === 'number' && Number.isFinite(value)`。
- 与全局 `isFinite()` 的区别：不做类型转换。`window.isFinite('123')` 为 `true`，但此函数返回 `false`。
- 与 `isNumber` 的区别：`isNumber` 允许 `Infinity`（只排除 NaN），此函数连 Infinity 也排除。
- **全局遮蔽**：`import { isFinite } from '@fexd/tools'` 会遮蔽全局 `isFinite`。如需同时使用两者，可使用别名：`import { isFinite as fexdIsFinite } from '@fexd/tools'`。

## 另见

- [`isNumber`](./isNumber) — 判断是否为 number（包括 Infinity，排除 NaN）
- [`isInteger`](./isInteger) — 判断是否为整数
- [`isNaN`](./isNaN) — 判断是否为 NaN
