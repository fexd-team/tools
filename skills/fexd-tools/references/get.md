# get / set

按路径安全读写对象属性。

```ts
import { get, set } from '@fexd/tools'
```

## get 签名

```ts
function get<T = any>(obj: any, keys?: string | any[] | number, defaultValue?: any): T
```

## set 签名

```ts
const set = (obj?: Record<string, any>, keys?: string | any[] | number, value?: any): Record<string, any>
```

## 用法

```ts
const obj = { a: { b: { c: 'hello' } } }

// get
get(obj, 'a.b.c')             // => 'hello'
get(obj, 'a.b.d', 'default')  // => 'default'
get(obj, ['a', 'b', 'c'])     // => 'hello'
get(null, 'a.b')              // => undefined（安全，不报错）

// set（不可变，返回新对象）
set({}, 'a.b.c', 'hello')
// => { a: { b: { c: 'hello' } } }

const result = set({ x: 1 }, 'x', 2)
// result => { x: 2 }（原对象不变）
```

## 注意事项

- `get` 路径访问被 try/catch 包裹，不会抛错
- `set` 是不可变操作，始终返回新对象
- 路径支持点号字符串、数组、数字
