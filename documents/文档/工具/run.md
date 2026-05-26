# run

按路径安全调用对象中的函数，或直接返回非函数值。

## 类型签名

```ts
const run = <T = any>(obj: any, keys?: KType, ...args: any[]): T
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `obj` | `any` | 是 | — | 源对象或值 |
| `keys` | `KType` | 否 | `[]` | 属性路径，支持点号字符串、数组或数字 |
| `...args` | `any[]` | 否 | — | 传给目标函数的参数 |

## 返回值

`T` — 若路径值为函数，调用后返回其返回值；若为非函数值，直接返回该值。

## 示例

```ts
import { run } from '@fexd/tools'

const obj = {
  a: {
    b: {
      greet: (name) => `Hello, ${name}!`,
      count: 42,
    },
  },
}

// 路径为函数时，调用并传参
run(obj, 'a.b.greet', 'World')  // => 'Hello, World!'

// 路径为非函数时，直接返回值
run(obj, 'a.b.count')            // => 42

// 路径不存在时，返回 undefined
run(obj, 'a.b.missing')         // => undefined

// 函数调用时 this 指向父对象
const ctx = { name: 'test', getName() { return this.name } }
run(ctx, 'getName')             // => 'test'
```

## 注意

- 当路径值为函数时，`this` 指向路径的**父对象**。
- 路径不存在或值为 `undefined` 时，返回 `undefined`，不会报错。

## 另见

- [`get`](./get) — 按路径取值（不调用）
- [`value`](./value) — 取第一个非 `undefined` 的值
