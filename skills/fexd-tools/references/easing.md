# easing

50+ 缓动函数集合，`position` 为动画进度 0~1，返回变换后的进度。

```ts
import { easing } from '@fexd/tools'
```

## 适用场景

- 配合 Tween 等动画库选择缓动曲线，控制动画节奏
- 页面滚动、位移、缩放等过渡效果需要非线性插值时
- UI 微交互（弹窗淡入、按钮回弹）需要弹性/回弹曲线时
- 需要在 0~1 进度值上做数学变换（如加速/减速/弹跳）时

## 不适用场景

- 需要自定义任意关键帧插值逻辑（easing 仅做进度映射）
- 需要 CSS 动画类名或 @keyframes 定义（easing 是函数而非声明式）
- 非浏览器动画场景中需要帧精确控制时

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

## 相关函数

- `Tween` — 使用 easing 函数驱动补间动画
- `FrameProcess` — 提供帧调度能力，是 Tween 的底层依赖
