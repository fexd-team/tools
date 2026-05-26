# hexToRgb

将十六进制颜色字符串解析为 RGB(A) 对象。

```ts
import { hexToRgb } from '@fexd/tools'
```

## 签名

```ts
const hexToRgb = (hex: string): { r: number; g: number; b: number; a?: number }
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `hex` | `string` | `#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa` 格式 |

## 用法

```ts
hexToRgb('#ff0000')     // => { r: 255, g: 0, b: 0 }
hexToRgb('#1890ff')     // => { r: 24, g: 144, b: 255 }
hexToRgb('#fff')        // => { r: 255, g: 255, b: 255 }（3 位简写）
hexToRgb('#ff000080')   // => { r: 255, g: 0, b: 0, a: 0.5 }（8 位带 alpha）
hexToRgb('#f008')       // => { r: 255, g: 0, b: 0, a: 0.53 }（4 位带 alpha）
```

## 注意事项

- 支持所有 CSS Color Module Level 4 hex 格式：`#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa`
- 不含 alpha 的格式（3/6 位）不返回 `a` 字段
- `a` 为 0–1 浮点数，精确到 2 位小数
- 大小写不敏感
- 不支持 `rgb()`/`hsl()` 格式
