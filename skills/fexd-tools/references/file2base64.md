# file2base64

将 `File` 读取为 base64 Data URL 字符串。

```ts
import { file2base64 } from '@fexd/tools'
```

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
