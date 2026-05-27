# safeStringify

安全的 JSON 序列化，自动处理循环引用并跳过 React 元素。

## 类型签名

```ts
safeStringify(object: any): string
```

## 参数

| 参数     | 类型  | 必填 | 默认值 | 说明           |
| -------- | ----- | ---- | ------ | -------------- |
| `object` | `any` | 是   | —      | 待序列化的对象 |

## 返回值

`string` — JSON 字符串。循环引用处标记为 `"[Circular]"`，React 元素被忽略。

## 示例

```ts
import { safeStringify } from '@fexd/tools'

// 普通对象
safeStringify({ a: 1, b: 'hello' })
// => '{"a":1,"b":"hello"}'

// 循环引用
const obj = { name: 'foo' }
obj.self = obj
safeStringify(obj)
// => '{"name":"foo","self":"[Circular]"}'

// React 元素会被跳过
import React from 'react'
safeStringify({ ui: <div />, data: 123 })
// => '{"data":123}'
```

## 注意

- 基于 `JSON.stringify` 的 replacer 参数实现，使用祖先栈检测循环引用。
- React 元素（通过 `isReactElementLike` 检测）序列化为 `undefined`（JSON 中被忽略）。
- 适合日志记录、状态调试、网络传输前的安全序列化场景。
- 不支持 `space` 参数（格式化缩进），如需美化输出请在结果上调用 `JSON.parse` + `JSON.stringify`。

## 另见

- [`isReactElementLike`](../guards/isReactElementLike) — React 类型检测
