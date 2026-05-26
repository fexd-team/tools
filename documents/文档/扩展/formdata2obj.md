# formdata2obj

将 `FormData` 实例转换为普通对象，支持解析 `key[subkey]`、`key[]` 等嵌套语法。

## 类型签名

```ts
function formdata2obj(formData: FormData): Record<string, any>
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `formData` | `FormData` | 是 | — | 要转换的 FormData 实例 |

## 返回值

`Record<string, any>` — 解析后的嵌套对象结构。

## 示例

```ts
import { formdata2obj } from '@fexd/tools'

// 简单键值
const fd = new FormData()
fd.append('name', 'Alice')
fd.append('age', '25')
formdata2obj(fd)
// => { name: 'Alice', age: '25' }

// 同名键 → 数组
const fd2 = new FormData()
fd2.append('color', 'red')
fd2.append('color', 'blue')
formdata2obj(fd2)
// => { color: ['red', 'blue'] }

// key[] 语法 → 数组
const fd3 = new FormData()
fd3.append('tags[]', 'js')
fd3.append('tags[]', 'ts')
formdata2obj(fd3)
// => { tags: ['js', 'ts'] }

// key[subkey] 语法 → 嵌套对象
const fd4 = new FormData()
fd4.append('user[name]', 'Bob')
fd4.append('user[age]', '30')
formdata2obj(fd4)
// => { user: { name: 'Bob', age: '30' } }

// 深层嵌套
const fd5 = new FormData()
fd5.append('config[db][host]', 'localhost')
fd5.append('config[db][port]', '5432')
formdata2obj(fd5)
// => { config: { db: { host: 'localhost', port: '5432' } } }
```

## 注意

- 同名键（无括号）多次 append 时合并为数组。
- `key[]` 语法自动识别为数组追加。
- `key[subkey]` 语法还原为嵌套对象结构。
- 值保持 FormData 原始类型（字符串或 File），不做 JSON 解析或类型转换。
- 与 `obj2formdata` 互为逆操作，可双向转换。

## 另见

- [`obj2formdata`](./obj2formdata) — 对象转 FormData（逆操作）
