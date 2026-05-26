# pick / pickBy

从对象中选取属性。`pick` 按键名选取，`pickBy` 按条件选取。

```ts
import { pick, pickBy, isNumber, isString } from '@fexd/tools'
```

## pick 签名

```ts
const pick = (obj: Record<string, any>, keys?: any[]): Record<string, any>
```

## pickBy 签名

```ts
const pickBy = (
  obj: Record<string, any>,
  predicate?: (value: any, key: string) => boolean
): Record<string, any>
```

## 用法

```ts
const user = { id: 1, name: 'Alice', age: 25, role: null }

// pick：按键名
pick(user, ['id', 'name'])
// => { id: 1, name: 'Alice' }

// pickBy：默认过滤 null/undefined
pickBy(user)
// => { id: 1, name: 'Alice', age: 25 }

// pickBy：自定义条件
pickBy(user, isNumber)
// => { id: 1, age: 25 }

pickBy(user, (v, k) => k.length > 2)
// => { name: 'Alice', age: 25, role: null }
```

## 注意事项

- 始终返回新对象，不修改源对象
- `pick` 中不存在的键会被忽略
- `pickBy` 默认使用 `isExist` 过滤 null/undefined
