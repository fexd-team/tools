# darkenColor

将 Hex 颜色加深指定百分比。

```ts
import { darkenColor } from '@fexd/tools'
```

## 适用场景

- 根据主题色自动生成悬停态或按下态的深色变体
- UI 组件库需要基于品牌色派生暗色系的场景
- 暗色模式下需要将主色加深以降低对比度

## 不适用场景

- 需要加亮颜色而非加深（应使用其他亮化工具）
- 输入颜色为 3 位简写或 rgb()/hsl() 格式（仅支持 #rrggbb）
- 需要 HSL 色彩空间的精确调色

## 签名

```ts
const darkenColor = (hexColor: string, percentage: number): string
```

## 参数

| 参数         | 类型     | 说明                |
| ------------ | -------- | ------------------- |
| `hexColor`   | `string` | `#rrggbb` 格式      |
| `percentage` | `number` | 加深百分比（0–100） |

## 用法

```ts
darkenColor('#ffffff', 50) // => '#7f7f7f'
darkenColor('#ff0000', 20) // => '#cc0000'
darkenColor('#336699', 0) // => '#336699'（不变）
```

## 注意事项

- 每个通道按 `value * (1 - percentage / 100)` 计算，结果限定在 `[0, 255]`
- 仅支持 6 位 Hex 格式（`#rrggbb`），不支持 3 位简写或 `rgb()`

## 相关函数

- `getBrightness` — 计算颜色感知亮度，可用于判断是否需要加深
- `hexToRgb` — 将 Hex 颜色解析为 RGB 对象，darkenColor 的底层依赖
- `randomRGB` — 随机生成 Hex 颜色，可与 darkenColor 搭配派生暗色
