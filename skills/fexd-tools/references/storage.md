# storage

`localStorage` / `sessionStorage` 的 JSON 读写封装，含兼容性降级。

```ts
import { storage } from '@fexd/tools'
```

## 签名

```ts
function get(key: string): any
function set(key: string, value: any): string
function remove(key: string): void

function getSession(key: string): any
function setSession(key: string, value: any): string
function removeSession(key: string): void

const storage: {
  get
  set
  remove
  getSession
  setSession
  removeSession
}
```

## 用法

```ts
import { storage } from '@fexd/tools'

storage.set('user', { id: 1, name: 'alice' })
storage.get('user') // { id: 1, name: 'alice' }
storage.remove('user')

storage.setSession('token', 'abc')
storage.getSession('token')
```

## 注意事项

- 写入用 `safeStringify`，读取用 `JSON.parse`，失败时返回原始字符串
- `'undefined'` 或 `null` 存取值时返回 `undefined`
- 不支持 localStorage 时操作降级为 `console.warn('Storage unsupported')`
- 勿存储循环引用对象；React 元素会被安全序列化忽略
