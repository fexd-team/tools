# get / set

按路径安全读写对象属性。

```ts
import { get, set } from '@fexd/tools'
```

## 适用场景

- 按动态路径字符串安全读取嵌套值（如后端返回的字段路径）
- 按路径不可变地设置嵌套值（返回新对象，不修改原对象）
- 访问可能为 null/undefined 的中间层对象，避免报错

## 不适用场景

- 路径在编码时已知且静态，且项目支持 ES2020+ 或有垫片 → 用可选链 `obj?.a?.b?.c` 更简洁
- 只需简单默认值，且项目支持 ES2020+ 或有垫片 → 用空值合并 `obj?.a?.b ?? defaultValue`
- 需要多个值回退 → 用 `value`
- 需要安全调用对象上的方法 → 用 `run`（自动绑定 this）
- 需要从对象中选取多个键 → 用 `pick`

## get 签名

```ts
function get<T = any>(
  obj: any,
  keys?: string | any[] | number,
  defaultValue?: any
): T
```

## set 签名

```ts
const set = (obj?: Record<string, any>, keys?: string | any[] | number, value?: any): Record<string, any>
```

## 用法

```ts
const obj = { a: { b: { c: 'hello' } } }

get(obj, 'a.b.c') // => 'hello'
get(obj, 'a.b.d', 'default') // => 'default'
get(obj, ['a', 'b', 'c']) // => 'hello'
get(null, 'a.b') // => undefined

set({}, 'a.b.c', 'hello')
// => { a: { b: { c: 'hello' } } }

const result = set({ x: 1 }, 'x', 2)
// result => { x: 2 }（原对象不变）
```

## 注意事项

- `get` 路径访问被 try/catch 包裹，不会抛错
- `set` 是不可变操作，始终返回新对象
- 路径支持点号字符串、数组、数字

## 相关函数

- `value` — 多值回退链，依次尝试直到非 undefined
- `run` — 按路径安全调用函数，自动绑定 this
- `pick` — 从对象中选取指定键
