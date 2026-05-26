# flatten

将嵌套数组扁平化到指定深度。

```ts
import { flatten } from '@fexd/tools'
```

## 签名

```ts
const flatten = <T = any>(array: any[], deep?: number): T[]
```

## 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `array` | `any[]` | — | 要扁平化的数组 |
| `deep` | `number` | `Infinity` | 扁平化深度 |

## 用法

```ts
flatten([1, [2, [3, [4]]]])       // => [1, 2, 3, 4]
flatten([1, [2, [3, [4]]]], 1)    // => [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2)    // => [1, 2, 3, [4]]
```

## 注意事项

- 只扁平化 Array 实例，类数组对象不会展开
- `deep = 0` 时返回原数组的浅拷贝
