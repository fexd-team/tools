# formdata2obj

将 `FormData` 转为普通对象，可选嵌套键解析。

```ts
import { formdata2obj } from '@fexd/tools'
```

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
