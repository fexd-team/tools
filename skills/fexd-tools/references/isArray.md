# isArray

判断值是否为数组，优先使用 `Array.isArray`，降级用 `toString` 检测。

```ts
import { isArray } from '@fexd/tools'
```

## 适用场景

- 判断值是否为数组
- 跨 realm 安全判断（iframe 中的数组）

## 不适用场景

- 需要判断类数组对象 → 需自行检查 length 属性
- 需要判断可迭代对象 → 用 isIterable

## 签名

```ts
isArray(value: any): value is Array<any>
```

## 用法

```ts
isArray([1, 2, 3]) // true
isArray([]) // true
isArray(new Array(3)) // true

isArray({}) // false
isArray('[]') // false
isArray(null) // false
```

## 注意事项

- 带 TypeScript 类型守卫，收窄后可直接当数组使用
- 旧环境无 `Array.isArray` 时回退 `[object Array]` 判断
- 比 `instanceof Array` 更可靠（跨 iframe/realm）

## 相关函数

- `isObject` — 判断值是否为对象
- `isIterable` — 判断值是否可迭代
