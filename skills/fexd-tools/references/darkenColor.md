# darkenColor

将 Hex 颜色加深指定百分比。

```ts
import { darkenColor } from '@fexd/tools'
```

## 签名

```ts
const darkenColor = (hexColor: string, percentage: number): string
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `hexColor` | `string` | `#rrggbb` 格式 |
| `percentage` | `number` | 加深百分比（0–100） |

## 用法

```ts
darkenColor('#ffffff', 50)  // => '#7f7f7f'
darkenColor('#ff0000', 20)  // => '#cc0000'
darkenColor('#336699', 0)   // => '#336699'（不变）
```

## 注意事项

- 每个通道按 `value * (1 - percentage / 100)` 计算，结果限定在 `[0, 255]`
- 仅支持 6 位 Hex 格式（`#rrggbb`），不支持 3 位简写或 `rgb()`
