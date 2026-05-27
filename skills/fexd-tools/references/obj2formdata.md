# obj2formdata

将普通对象序列化为 `FormData`，可选递归嵌套。

```ts
import { obj2formdata } from '@fexd/tools'
```

## 签名

```ts
interface Obj2FormdataOptions {
  indices?: boolean
  nullsAsUndefined?: boolean
  booleansAsIntegers?: boolean
  nested?: boolean
}

function obj2formdata(
  obj: Record<string, any>,
  options?: Obj2FormdataOptions
): FormData
```

## 用法

```ts
const fd = obj2formdata({ name: 'bob', age: 18 })
// name=bob&age=18（简单 append）

const fd2 = obj2formdata(
  { user: { name: 'bob' }, tags: ['a', 'b'] },
  { nested: true }
)
// user[name]=bob, tags[]=a, tags[]=b
```

## 注意事项

- 默认扁平：`Object.keys` 直接 `append`，值会 `toString`
- `nested: true` 递归处理对象、数组、Date、File/Blob、布尔
- `indices: true` 数组用 `key[0]` 而非 `key[]`
- `null` 默认 append 空字符串；`nullsAsUndefined` 可跳过
