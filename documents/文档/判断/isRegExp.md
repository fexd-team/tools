# isRegExp

判断值是否为正则表达式（`RegExp`）实例。

## 类型签名

```ts
const isRegExp = (val: any): val is RegExp
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `val` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为 `RegExp` 实例时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫。

## 示例

```ts
import { isRegExp } from '@fexd/tools'

isRegExp(/abc/)           // => true
isRegExp(new RegExp('a')) // => true
isRegExp('abc')           // => false
isRegExp({})              // => false
```

## 注意

- 基于 `instanceof RegExp` 判断，跨 iframe/realm 的正则可能返回 `false`。

## 另见

- [`isString`](./isString) — 判断是否为字符串
- [`isObject`](./isObject) — 判断是否为纯对象
