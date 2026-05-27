# copy

将文本、数字或 DOM 节点内容复制到剪贴板。

```ts
import { copy } from '@fexd/tools'
```

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
