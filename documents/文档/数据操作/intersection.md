# intersection

返回多个数组的交集（同时存在于所有数组中的元素）。

## 类型签名

```ts
const intersection = (...args: any[][]): any[]
```

## 参数

| 参数      | 类型      | 必填 | 默认值 | 说明           |
| --------- | --------- | ---- | ------ | -------------- |
| `...args` | `any[][]` | 是   | —      | 两个或多个数组 |

## 返回值

`any[]` — 所有输入数组的交集。

## 示例

```ts
import { intersection } from '@fexd/tools'

intersection([1, 2, 3], [2, 3, 4]) // => [2, 3]
intersection([1, 2], [2, 3], [2, 5]) // => [2]
intersection([1, 2], [3, 4]) // => []
```

## 注意

- 内部会先扁平化输入数组列表并用 `Set` 去重，返回的交集不含重复元素。
- 元素比较使用 `Array.includes()`，遵循严格相等（`===`），对象引用不同则视为不同元素。
- 传入单个数组时，等价于返回该数组的去重结果。

## 另见

- [`difference`](./difference) — 数组差集
- [`uniqByKey`](./uniqByKey) — 按键去重
