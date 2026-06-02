# storage

`localStorage` / `sessionStorage` 的 JSON 读写封装，含兼容性降级。

```ts
import { storage } from '@fexd/tools'
```

## 适用场景

- 在浏览器中持久化存储用户偏好、Token 等小型数据
- 使用 `sessionStorage` 存储会话级临时数据
- 需要自动 JSON 序列化/反序列化的本地存储读写

## 不适用场景

- SSR（服务端渲染）环境，`localStorage` 不可用
- 存储大量数据（受浏览器 5MB 限制）
- 需要跨域共享存储数据的场景

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

## 相关函数

- `globalThis` — 跨环境全局对象访问，`storage` 依赖其检测 localStorage
- `compactObject` — 压缩对象中的空值，可用于存储前清理数据
