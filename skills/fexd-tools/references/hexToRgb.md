# hexToRgb

将十六进制颜色字符串解析为 RGB(A) 对象。

```ts
import { hexToRgb } from '@fexd/tools'
```

## 适用场景

- 需要将 Hex 颜色转为 RGB 值用于 Canvas 或 WebGL 渲染
- 颜色运算（加深、混合、透明度叠加）前需解析为数值
- CSS-in-JS 中将 Hex 转为 rgba() 字符串时提取通道值

## 不适用场景

- 输入为 rgb()/hsl() 字符串（仅支持 Hex 格式）
- 需要将 RGB 转回 Hex（此函数为单向解析）
- 需要色彩空间转换（如 RGB 转 HSL）

## 签名

```ts
const hexToRgb = (hex: string): { r: number; g: number; b: number; a?: number }
```

## 参数

| 参数  | 类型     | 说明                                         |
| ----- | -------- | -------------------------------------------- |
| `hex` | `string` | `#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa` 格式 |

## 用法

```ts
hexToRgb('#ff0000') // => { r: 255, g: 0, b: 0 }
hexToRgb('#1890ff') // => { r: 24, g: 144, b: 255 }
hexToRgb('#fff') // => { r: 255, g: 255, b: 255 }（3 位简写）
hexToRgb('#ff000080') // => { r: 255, g: 0, b: 0, a: 0.5 }（8 位带 alpha）
hexToRgb('#f008') // => { r: 255, g: 0, b: 0, a: 0.53 }（4 位带 alpha）
```

## 注意事项

- 支持所有 CSS Color Module Level 4 hex 格式：`#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa`
- 不含 alpha 的格式（3/6 位）不返回 `a` 字段
- `a` 为 0–1 浮点数，精确到 2 位小数
- 大小写不敏感
- 不支持 `rgb()`/`hsl()` 格式

## 相关函数

- `darkenColor` — 加深颜色，内部使用 hexToRgb 解析 Hex
- `randomRGB` — 随机生成 Hex 颜色，可与 hexToRgb 配合获取 RGB 值
