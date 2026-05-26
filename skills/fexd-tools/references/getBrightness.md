# getBrightness

计算 Hex 颜色的感知亮度值（基于 ITU-R BT.601 标准）。

```ts
import { getBrightness } from '@fexd/tools'
```

## 签名

```ts
const getBrightness = (hexColor: string): number
```

## 用法

```ts
getBrightness('#ffffff')  // => 255（纯白）
getBrightness('#000000')  // => 0（纯黑）
getBrightness('#ff0000')  // => 76.245（红色）

// 常见用法：自动选择文字颜色
const textColor = getBrightness(bgColor) > 128 ? '#000' : '#fff'
```

## 注意事项

- 公式为 `0.299 * R + 0.587 * G + 0.114 * B`（人眼对绿色最敏感）
- 返回值范围 `[0, 255]`，阈值 128 通常可区分深色/浅色
- 仅支持 6 位 Hex 格式（`#rrggbb`）
