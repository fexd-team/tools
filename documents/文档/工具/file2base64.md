# file2base64

将 `File` 对象转换为 Base64 编码的 Data URL 字符串。

## 类型签名

```ts
const file2base64 = (file: File): Promise<string>
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `file` | `File` | 是 | — | 要转换的文件对象 |

## 返回值

`Promise<string>` — resolve 为 `data:` 开头的 Base64 编码字符串。

## 示例

```ts
import { file2base64 } from '@fexd/tools'

// 从 input 元素获取文件
const file = document.querySelector('input[type=file]').files[0]
const base64 = await file2base64(file)
// => 'data:image/png;base64,iVBORw0KGgo...'

// 用于图片预览
img.src = base64
```

## 注意

- 仅在浏览器环境可用，依赖 `FileReader` API。
- 大文件转换耗时较长，建议搭配 loading 提示使用。
- 读取失败时 Promise 会 reject。

## 另见

- [`preloadImage`](../渲染/preloadImage) — 预加载图片
