# set

按路径安全设值，返回新对象（不修改原对象）。

## 类型签名

```ts
const set = (
  obj?: Record<string, any>,
  keys?: KType,
  value?: any
): Record<string, any>
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `obj` | `Record<string, any>` | 否 | `{}` | 源对象（不会被修改） |
| `keys` | `KType` | 否 | `[]` | 属性路径，支持点号字符串、数组或数字 |
| `value` | `any` | 否 | — | 要设置的值 |

## 返回值

`Record<string, any>` — 设置后的新对象，原对象不变。

## 示例

```ts
import { set } from '@fexd/tools'

set({}, 'a.b.c', 'hello')
// => { a: { b: { c: 'hello' } } }

const obj = { x: 1 }
const result = set(obj, 'x', 2)
// => { x: 2 }
// obj 仍然是 { x: 1 }（原对象不变）
```

## 注意

- `set` 是 **不可变操作**，始终返回新对象，不会修改原对象。
- 路径中间不存在的属性会自动创建为空对象。

## 另见

- [`get`](./get) — 按路径安全取值
