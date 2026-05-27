# shallowMerge

浅合并多个对象，后续对象的属性覆盖前面的。

## 类型签名

```ts
const shallowMerge = <T extends Record<string, any>>(
  first: T,
  ...rest: Partial<T>[]
): T
```

## 参数

| 参数      | 类型           | 必填 | 默认值 | 说明             |
| --------- | -------------- | ---- | ------ | ---------------- |
| `first`   | `T`            | 是   | —      | 基础对象         |
| `...rest` | `Partial<T>[]` | 否   | —      | 要合并的对象列表 |

## 返回值

`T` — 合并后的新对象。

## 示例

```ts
import { shallowMerge } from '@fexd/tools'

shallowMerge({ a: 1, b: 2 }, { b: 3, c: 4 })
// => { a: 1, b: 3, c: 4 }

shallowMerge({ x: 1 }, { x: 2 }, { x: 3 })
// => { x: 3 }
```

## 注意

- 仅做浅层合并，嵌套对象/数组按引用赋值。如需深度合并，请使用 `deepMerge`。
- 返回新对象，不会修改原对象。
- 仅合并对象自有属性（`hasOwnProperty`）。

## 另见

- [`deepMerge`](./deepMerge) — 深度合并对象
