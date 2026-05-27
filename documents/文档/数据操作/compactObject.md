# compactObject

过滤对象中的空值（`null`、`undefined`、空字符串），返回新对象。

## 类型签名

```ts
const compactObject = (obj: Record<string, any>): Record<string, any>
```

## 参数

| 参数  | 类型                  | 必填 | 默认值 | 说明         |
| ----- | --------------------- | ---- | ------ | ------------ |
| `obj` | `Record<string, any>` | 是   | —      | 要过滤的对象 |

## 返回值

`Record<string, any>` — 仅包含非空值的新对象。

## 示例

```ts
import { compactObject } from '@fexd/tools'

compactObject({ a: 1, b: null, c: '', d: 0, e: undefined })
// => { a: 1, d: 0 }

compactObject({ name: 'Alice', age: null })
// => { name: 'Alice' }

// 典型场景：构建请求参数时过滤空值
const params = compactObject({
  keyword: searchText,
  page: 1,
  category: selectedCategory || '', // 未选择时为空字符串，会被过滤
  tag: null, // 会被过滤
})
// fetch(`/api/list?${new URLSearchParams(params)}`)
```

## 注意

- 空值定义为：`null`、`undefined`、`''`（空字符串）。
- `0`、`false` 等 falsy 值会被保留。
- 返回新对象，不会修改原对象。
- 传入 falsy 值（如 `null`、`undefined`）时返回空对象 `{}`。
- 原名 `filterObjectEmptyValue`，已重命名为更简洁的 `compactObject`。

## 另见

- [`pickBy`](../data/pickBy) — 按条件筛选对象的键值对
- [`isExist`](../guards/isExist) — 判断是否非 null 且非 undefined
