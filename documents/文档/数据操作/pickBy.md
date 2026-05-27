# pickBy

按条件函数筛选对象的键值对，返回新对象。默认过滤掉值为 `null` 或 `undefined` 的属性。

## 类型签名

```ts
const pickBy = (
  obj: Record<string, any>,
  predicate?: (...args: any[]) => boolean
): Record<string, any>
```

## 参数

| 参数        | 类型                      | 必填 | 默认值    | 说明                                 |
| ----------- | ------------------------- | ---- | --------- | ------------------------------------ |
| `obj`       | `Record<string, any>`     | 是   | —         | 源对象                               |
| `predicate` | `(value, key) => boolean` | 否   | `isExist` | 筛选条件函数，返回 `true` 时保留该键 |

## 返回值

`Record<string, any>` — 筛选后的新对象。

## 示例

```ts
import { pickBy, isNumber } from '@fexd/tools'

const obj = { id: 1, name: 'Alice', age: 25, role: null }

// 默认：过滤 null/undefined
pickBy(obj)
// => { id: 1, name: 'Alice', age: 25 }

// 自定义条件：只保留数字值
pickBy(obj, isNumber)
// => { id: 1, age: 25 }

// 条件函数接收 (value, key)
pickBy(obj, (v, k) => k.length > 2)
// => { name: 'Alice', age: 25, role: null }
```

## 注意

- 默认使用 `isExist` 过滤 `null` 和 `undefined`。
- 始终返回新对象，不修改源对象。
- `predicate` 签名为 `(value, key)`，内部通过 `run()` 调用。

## 另见

- [`pick`](./pick) — 按键名选取
- [`isExist`](../guards/isExist) — 判断值是否非 null/undefined
