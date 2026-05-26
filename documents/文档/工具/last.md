# last

获取数组或对象的最后一个元素/值。

## 类型签名

```ts
const last = <T = any>(value: any[] | Record<string, any>): T
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any[] \| Record<string, any>` | 是 | — | 数组或对象 |

## 返回值

`T` — 数组的最后一个元素，或对象最后一个键对应的值。若输入为其他类型返回 `undefined`。

## 示例

```ts
import { last } from '@fexd/tools'

last([1, 2, 3])       // => 3
last(['a', 'b'])      // => 'b'
last({ x: 1, y: 2 }) // => 2（取最后一个键的值）
last([])              // => undefined
```

## 注意

- 对象场景下「最后一个」取决于 `Object.keys()` 的键顺序，不保证与插入顺序一致（整数键除外）。
- 空数组或空对象返回 `undefined`。
- 传入非数组、非对象类型时返回 `undefined`。

## 另见

- [`first`](./first) — 获取第一个元素
