# difference

返回数组差集：arr1 中存在但 arr2 中不存在的元素。

```ts
import { difference } from '@fexd/tools'
```

## 签名

```ts
function difference(arr1: any[], arr2: any[]): any[]
```

## 用法

```ts
difference([1, 2, 3, 4], [2, 4])  // => [1, 3]
difference(['a', 'b', 'c'], ['b'])  // => ['a', 'c']
```

## 注意事项

- 使用 `Array.includes()` 严格相等比较
- 保留 arr1 中的顺序与重复项，不做去重
