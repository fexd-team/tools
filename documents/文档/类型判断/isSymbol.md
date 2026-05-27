# isSymbol

判断值是否为 `Symbol` 类型。

## 类型签名

```ts
isSymbol(value: any): value is symbol
```

## 参数

| 参数    | 类型  | 必填 | 默认值 | 说明       |
| ------- | ----- | ---- | ------ | ---------- |
| `value` | `any` | 是   | —      | 要判断的值 |

## 返回值

`boolean` — 当值为 Symbol 时返回 `true`。具有 TypeScript 类型守卫。

## 示例

```ts
import { isSymbol } from '@fexd/tools'

isSymbol(Symbol()) // => true
isSymbol(Symbol('desc')) // => true
isSymbol(Symbol.iterator) // => true

isSymbol('symbol') // => false
isSymbol(42) // => false
isSymbol(null) // => false
isSymbol({}) // => false
```

## 注意

- 使用 `typeof value === 'symbol'` 实现，跨 realm 安全。
- `Symbol` 不能通过 `new Symbol()` 创建，只能通过 `Symbol()` 工厂函数。
- ES6+ 环境才支持 Symbol。

## 另见

- [`isString`](./isString) — 判断是否为字符串
- [`isNumber`](./isNumber) — 判断是否为数字
