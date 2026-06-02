# file2base64

将 `File` 读取为 base64 Data URL 字符串。

```ts
import { file2base64 } from '@fexd/tools'
```

## 适用场景

- 文件上传前在页面中预览图片（将 File 转为 Data URL 赋给 `<img>`）
- 将小文件编码后通过 JSON API 传输，无需 FormData
- 在前端对文件内容做简单处理（如读取文本文件内容）

## 不适用场景

- Node.js 或无 `FileReader` 的非浏览器环境，浏览器专用
- 大文件转 base64 会显著增加内存占用（体积膨胀约 33%），不适合大文件处理
- 需要获取原始二进制数据（ArrayBuffer）而非 Data URL 字符串的场景
- 需要流式读取或分片处理的场景

## 签名

```ts
const file2base64 = (file: File): Promise<string>
```

## 用法

```ts
const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const dataUrl = await file2base64(file)
  // 'data:image/png;base64,iVBORw0KGgo...'
  preview.src = dataUrl
}
```

## 注意事项

- 使用 `FileReader.readAsDataURL`，结果为完整 Data URL
- 读取失败时 Promise reject，传递 `reader.onerror`
- 仅接受 `File` 类型，大文件需注意内存占用

## 相关函数

- `preloadImage` — 预加载图片，常与 file2base64 配合实现图片预览与预加载
- `copy` — 复制到剪贴板，可将 base64 字符串复制分享
- `formdata2obj` — FormData 转对象，同为文件/表单数据处理工具
