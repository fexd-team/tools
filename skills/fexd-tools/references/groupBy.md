# groupBy

按指定规则对数组元素进行分组。

```ts
import { groupBy } from '@fexd/tools'
```

## 适用场景

- 按规则对数组分组
- 按属性对对象数组分类

## 不适用场景

- 只需去重 → 用 `uniqByKey`
- 需要扁平化 → 用 `flatten`
- 需要按 key 排序 → 需自行排序

## 签名

```ts
const groupBy = (namer: Function, list: any[]): Record<string, any[]>
```

## 用法

```ts
groupBy((n) => (n % 2 === 0 ? 'even' : 'odd'), [1, 2, 3, 4, 5])
// => { odd: [1, 3, 5], even: [2, 4] }

groupBy(
  (user) => user.role,
  [
    { name: 'Alice', role: 'admin' },
    { name: 'Bob', role: 'user' },
    { name: 'Carol', role: 'admin' },
  ]
)
// => { admin: [Alice, Carol], user: [Bob] }
```

## 注意事项

- 分组名由 `namer` 返回值经 `String()` 转换
- 同一分组内保持原始数组的出现顺序

## 相关函数

- `uniqByKey` — 按键去重，可视为分组后每组取首个
- `flatten` — 扁平化嵌套数组，与分组操作方向相反
