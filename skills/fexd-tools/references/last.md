# last

返回数组的最后一个元素，或对象最后一个键对应的值。

```ts
import { last } from '@fexd/tools'
```

## 签名

```ts
const last = <T = any>(value: any[] | Object): T
```

## 用法

```ts
last([1, 2, 3]) // => 3
last({ a: 1, b: 2 }) // => 2（取 Object.keys 的最后一个键）
last([]) // => undefined
last({}) // => undefined
```

## 注意事项

- 对象按键名枚举顺序取末项，非插入顺序保证（依赖引擎实现）
- 非数组、非普通对象时返回 `undefined`
- 与 `first` 对称，可配合处理键值对集合
