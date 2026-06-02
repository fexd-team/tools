# formdata2obj

将 `FormData` 转为普通对象，可选嵌套键解析。

```ts
import { formdata2obj } from '@fexd/tools'
```

## 适用场景

- 将表单提交的 `FormData` 转为普通对象，便于 JSON 传输
- 处理带嵌套键名的表单数据（如 `user[name]`、`tags[]`）
- 在中间件或拦截器中统一转换 `FormData` 为对象

## 不适用场景

- 不涉及 `FormData` 的普通对象转换（直接使用即可）
- Node.js 环境（无 `FormData` 原生支持，需 polyfill）
- 需要保留文件（File/Blob）的场景，转换后文件信息会丢失

## 签名

```ts
interface Formdata2ObjOptions {
  /** 启用嵌套键解析（如 key[0]、key[prop]），默认 false */
  nested?: boolean
}

function formdata2obj(
  formData: FormData,
  options?: Formdata2ObjOptions
): Record<string, any>
```

## 用法

```ts
const fd = new FormData()
fd.append('name', 'alice')
fd.append('tags[]', 'a')
fd.append('tags[]', 'b')

formdata2obj(fd)
// { name: 'alice', 'tags[]': 'b' }  // 后者覆盖前者

formdata2obj(fd, { nested: true })
// { name: 'alice', tags: ['a', 'b'] }
```

## 注意事项

- 默认扁平模式：重复 key 后者覆盖
- `nested: true` 时解析 `key[0]`、`key[prop]` 等嵌套结构
- 重复扁平 key 在 nested 模式下会合并为数组

## 相关函数

- `obj2formdata` — 反向操作，将普通对象转为 `FormData`
- `qs` — QueryString 序列化，处理 URL 参数场景
