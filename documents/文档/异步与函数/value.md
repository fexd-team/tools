# value

返回参数列表中第一个非 `undefined` 的值。若值为函数，会调用取其返回值。

## 类型签名

```ts
const value = <T = any>(...values: any[]): T
```

## 参数

| 参数        | 类型    | 必填 | 默认值 | 说明                     |
| ----------- | ------- | ---- | ------ | ------------------------ |
| `...values` | `any[]` | 是   | —      | 候选值列表，从左到右检查 |

## 返回值

`T` — 第一个非 `undefined` 的值（若值为函数则取其调用结果）。

## 示例

```ts
import { value } from '@fexd/tools'

value(undefined, null, 'hello') // => null（null 不等于 undefined）
value(undefined, 0, 'hello') // => 0（0 不等于 undefined）
value(undefined, undefined, 42) // => 42
value(() => 'computed') // => 'computed'（函数会被调用）
```

## 注意

- 只有 `undefined` 被视为"空值"，`null`、`0`、`''`、`false` 都被视为有效值。
- 若值为函数，会通过 `run()` 调用取其返回值再判断。

## 另见

- [`run`](./run) — 安全调用函数或取值
