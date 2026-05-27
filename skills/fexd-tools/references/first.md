# first

返回数组的首个元素，或对象第一个键对应的值。

```ts
import { first } from '@fexd/tools'
```

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
