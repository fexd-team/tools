# groupBy

按指定规则对数组元素进行分组。

```ts
import { groupBy } from '@fexd/tools'
```

## 签名

```ts
const groupBy = (namer: Function, list: any[]): Record<string, any[]>
```

## 用法

```ts
groupBy((n) => (n % 2 === 0 ? 'even' : 'odd'), [1, 2, 3, 4, 5])
// => { odd: [1, 3, 5], even: [2, 4] }

groupBy((user) => user.role, [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Carol', role: 'admin' },
])
// => { admin: [Alice, Carol], user: [Bob] }
```

## 注意事项

- 分组名由 `namer` 返回值经 `String()` 转换
- 同一分组内保持原始数组的出现顺序
