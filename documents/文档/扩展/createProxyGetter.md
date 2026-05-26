# createProxyGetter

创建 Proxy 代理对象，所有属性访问经过 `valueHandler` 处理。

## 类型签名

```ts
function createProxyGetter(
  target: any,
  valueHandler: ((value: any, prop: any) => any) | any
): any
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `target` | `any` | 是 | — | 要代理的对象 |
| `valueHandler` | `Function \| any` | 是 | — | 属性值处理器。函数则调用之，否则对所有属性返回该值 |

## 返回值

`any` — 代理对象。若当前环境不支持 Proxy 或创建失败，返回原始对象。

## 示例

```ts
import { createProxyGetter } from '@fexd/tools'

// 所有属性访问返回大写
const proxy = createProxyGetter({ name: 'alice', age: 25 }, (value, prop) => {
  return typeof value === 'string' ? value.toUpperCase() : value
})
proxy.name  // => 'ALICE'
proxy.age   // => 25

// valueHandler 非函数时，已有属性全部返回该值
const always = createProxyGetter({ a: 1, b: 2 }, 42)
always.a  // => 42
always.b  // => 42
always.c  // => undefined（不存在的属性直接返回 undefined，不经过 handler）
```

## 注意

- 仅对 `target` **已有属性** 触发 `valueHandler`，访问不存在的属性直接返回 `undefined`。
- 若 Proxy 不可用或构造失败，会在 console 输出错误并返回原对象。

## 另见

- [`get`](../工具/get) — 按路径安全取值