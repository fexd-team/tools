# intersection

返回多个数组的交集（同时出现在所有数组中的元素）。

```ts
import { intersection } from '@fexd/tools'
```

## 签名

```ts
const intersection = (...args: any[][]): any[]
```

## 用法

```ts
intersection([1, 2, 3], [2, 3, 4]) // => [2, 3]
intersection(['a', 'b'], ['b', 'c'], ['b']) // => ['b']
intersection([1, 2], [3, 4]) // => []
```

## 注意事项

- 使用 `includes` 判断成员，按引用相等比较对象元素
- 结果顺序取自扁平化后的去重序列，非各数组原始顺序
- 内部经 `flatten` 与 `Set` 去重后再过滤
