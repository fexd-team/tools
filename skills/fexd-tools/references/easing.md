# easing

50+ 缓动函数集合，`position` 为动画进度 0~1，返回变换后的进度。

```ts
import { easing } from '@fexd/tools'
```

## 签名

```ts
type EasingFunction = (position?: number, ...args: any[]) => number

interface EasingFunctionMap {
  [key: string]: EasingFunction
}

const easing: EasingFunctionMap
```

## 用法

```ts
import { easing } from '@fexd/tools'
import { Tween } from '@fexd/tools'

// 直接调用
easing.inQuad(0.5) // 0.25
easing.outCubic(1) // 1
easing.inOutElastic(0.5, 400)

// 配合 Tween
new Tween({ from: 0, to: 100, ease: easing.outQuad })
  .on('update', (v) => (el.style.left = `${v}px`))
  .start()
```

## 注意事项

- 含 `linear`、`inQuad/outQuad/inOutQuad`、cubic、quart、quint、expo、sine、circ、elastic、back、bounce 等
- 另有 `sinusoidal`、`spring`、`wobble`、`pulse`、`flicker` 等特殊曲线
- `elastic` 等函数可传第二参 `m` 控制弹性系数（默认 400）
