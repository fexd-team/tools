# uniqByKey

按指定键对对象数组去重，只保留每个键值的首次出现。

```ts
import { uniqByKey } from '@fexd/tools'
```

## 适用场景

- 按键去重对象数组，保留首次出现
- 合并去重列表

## 不适用场景

- 需要分组 → 用 `groupBy`
- 简单值去重 → 用 `Set`
- 需要差集 → 用 `difference`

## 签名

```ts
const uniqByKey = <T = any>(array?: any[], key?: any): T[]
```

## 用法

```ts
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice2' },
]

uniqByKey(users, 'id')
// => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

## 注意事项

- 不传 `key` 时数组不会被去重
- 不含指定键的元素始终保留
- 相同键值保留首次出现的元素

## 相关函数

- `groupBy` — 按规则分组
- `difference` — 求差集
