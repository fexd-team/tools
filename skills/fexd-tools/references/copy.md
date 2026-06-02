# copy

将文本、数字或 DOM 节点内容复制到剪贴板。

```ts
import { copy } from '@fexd/tools'
```

## 适用场景

- 点击按钮复制文本内容到剪贴板（如复制分享链接、优惠码）
- 表格/列表中一键复制单元格数据
- 复制 DOM 节点的富文本内容（如文章正文 HTML）
- 实现自定义 Toast 提示"已复制"的交互

## 不适用场景

- Node.js 或无 `navigator.clipboard` / `document` 的服务端环境，浏览器专用
- 需要复制非文本数据（图片、文件等二进制内容）
- 需要精确控制剪贴板写入格式（如指定 MIME 类型）的复杂场景
- 对安全性要求高的剪贴板操作（需用户授权的 Clipboard API 场景）

## 签名

```ts
const copy = (content: string | number | HTMLElement): void | Promise<void>
```

## 用法

```ts
// 复制文本（隐藏 input + execCommand）
copy('hello world')

copy(12345)

// 复制 DOM 富文本（Clipboard API）
await copy(document.querySelector('.article')!)
```

## 注意事项

- 字符串/数字走 `execCommand('copy')`，需浏览器 DOM 环境
- 无 `document` 时仅 `console.warn`，不抛错
- DOM 节点需含 `innerHTML` 与 `textContent`，使用 `navigator.clipboard.write`
- DOM 复制为异步，文本复制为同步

## 相关函数

- `file2base64` — 将文件转为 base64 Data URL，可配合 copy 实现文件内容复制
- `storage` — 本地存储封装，与 copy 同属浏览器端数据操作工具
