# obj2formdata

将普通对象递归转换为 `FormData` 实例，支持嵌套对象、数组、File/Blob、Date 等类型。

## 类型签名

```ts
interface Obj2FormdataOptions {
  indices?: boolean          // 数组使用 [0] 而非 []，默认 false
  nullsAsUndefined?: boolean // null 跳过而非追加空字符串，默认 false
  booleansAsIntegers?: boolean // true/false → '1'/'0'，默认 false
}

function obj2formdata(obj: Record<string, any>, options?: Obj2FormdataOptions): FormData
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `obj` | `Record<string, any>` | 是 | — | 要转换的对象 |
| `options.indices` | `boolean` | 否 | `false` | 数组键名使用 `[0]` 而非 `[]` |
| `options.nullsAsUndefined` | `boolean` | 否 | `false` | `null` 值跳过（不追加） |
| `options.booleansAsIntegers` | `boolean` | 否 | `false` | 布尔值转为 `'1'`/`'0'` |

## 返回值

`FormData` — 递归序列化后的 FormData 实例。

## 示例

```ts
import { obj2formdata } from '@fexd/tools'

// 简单对象
const fd = obj2formdata({ name: 'Alice', age: 25 })
fd.get('name')  // => 'Alice'
fd.get('age')   // => '25'

// 嵌套对象 → key[subkey] 格式
obj2formdata({ user: { name: 'Bob', role: 'admin' } })
// user[name] = 'Bob', user[role] = 'admin'

// 数组 → key[] 格式
obj2formdata({ tags: ['js', 'ts'] })
// tags[] = 'js', tags[] = 'ts'

// 数组 + indices 选项 → key[0] 格式
obj2formdata({ tags: ['js', 'ts'] }, { indices: true })
// tags[0] = 'js', tags[1] = 'ts'

// File/Blob 直接追加
obj2formdata({ avatar: file, name: 'test' })

// Date → ISO 字符串
obj2formdata({ created: new Date() })
// created = '2024-01-15T10:30:00.000Z'

// null 处理
obj2formdata({ a: null })                             // a = ''
obj2formdata({ a: null }, { nullsAsUndefined: true }) // (跳过)

// undefined 总是被跳过
obj2formdata({ a: undefined, b: 'ok' })  // 只有 b = 'ok'
```

## 注意

- 递归处理嵌套结构，使用 `key[subkey]` 标准格式。
- `undefined` 值总是被跳过。
- `null` 默认转为空字符串（`''`），可通过 `nullsAsUndefined` 选项跳过。
- `File`/`Blob` 实例直接追加，不做序列化。
- 输入为 `null`/`undefined` 时返回空 FormData。

## 另见

- [`formdata2obj`](./formdata2obj) — FormData 转对象（逆操作）
