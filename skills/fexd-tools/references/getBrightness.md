# getBrightness

计算 Hex 颜色的感知亮度值（基于 ITU-R BT.601 标准）。

```ts
import { getBrightness } from '@fexd/tools'
```

## 适用场景

- 根据背景色自动选择深/浅文字颜色，保证可读性
- 判断颜色是否过暗或过亮，决定是否需要叠加遮罩
- 无障碍检测中评估文字与背景的对比度是否达标

## 不适用场景

- 需要完整的 WCAG 对比度计算（getBrightness 仅返回亮度值，不含对比度比率）
- 输入为非 Hex 格式（rgb 字符串、HSL 等）
- 需要 Alpha 通道参与计算（函数忽略透明度）

## 签名

```ts
const getBrightness = (hexColor: string): number
```

## 用法

```ts
getBrightness('#ffffff') // => 255（纯白）
getBrightness('#000000') // => 0（纯黑）
getBrightness('#ff0000') // => 76.245（红色）

// 常见用法：自动选择文字颜色
const textColor = getBrightness(bgColor) > 128 ? '#000' : '#fff'
```

## 注意事项

- 公式为 `0.299 * R + 0.587 * G + 0.114 * B`（人眼对绿色最敏感）
- 返回值范围 `[0, 255]`，阈值 128 通常可区分深色/浅色
- 仅支持 6 位 Hex 格式（`#rrggbb`）

## 相关函数

- `darkenColor` — 加深颜色，常与 getBrightness 配合实现自动调色
- `hexToRgb` — 将 Hex 解析为 RGB 对象，是 getBrightness 的底层依赖
