# randomRGB

随机生成一个 Hex 格式的 RGB 颜色值。

```ts
import { randomRGB } from '@fexd/tools'
```

## 签名

```ts
const randomRGB = (min?: number): string
```

## 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `min` | `number` | `0` | 每个通道的最小值（0–255），避免过暗 |

## 用法

```ts
randomRGB()     // => '#a3f2c1'（随机）
randomRGB(128)  // => '#e4d8f0'（较亮的颜色）
```

## 注意事项

- 每个通道值范围为 `[min, 255)`
- `min = 128` 可确保生成较亮的颜色
