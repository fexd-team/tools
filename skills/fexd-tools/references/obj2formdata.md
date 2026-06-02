# obj2formdata

将普通对象序列化为 `FormData`，可选递归嵌套。

```ts
import { obj2formdata } from '@fexd/tools'
```

## 适用场景

- 将普通对象转为 `FormData`，用于文件上传或表单提交
- 需要递归处理嵌套对象和数组的 `FormData` 序列化
- 将 API 请求参数从 JSON 格式转为 `multipart/form-data` 格式

## 不适用场景

- 简单的 URL 查询参数序列化，应使用 `qs.stringify`
- 不需要 `FormData` 的场景（普通 JSON 请求无需转换）
- Node.js 环境（无 `FormData` 原生支持，需 polyfill）

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

## 相关函数

- `formdata2obj` — 反向操作，将 `FormData` 转为普通对象
- `qs` — QueryString 序列化，用于 URL 参数而非 FormData
