# first

返回数组的首个元素，或对象第一个键对应的值。

```ts
import { first } from '@fexd/tools'
```

## 适用场景

- 安全取数组第一个元素

## 不适用场景

- 需要最后一个 → 用 `last`
- 需要随机取 → 用 `sample`

## 签名

```ts
const first = <T = any>(value: any[] | Object): T
```

## 用法

```ts
first([1, 2, 3]) // => 1
first({ a: 1, b: 2 }) // => 1（取 Object.keys 的第一个键）
first([]) // => undefined
first({}) // => undefined
```

## 注意事项

- 对象按键名枚举顺序取首项，非插入顺序保证（依赖引擎实现）
- 非数组、非普通对象时返回 `undefined`
- 与 `last` 对称，可配合处理键值对集合

## 相关函数

- `last` — 取最后一个元素
- `sample` — 随机取一个元素
