# Tween

基于 `requestAnimationFrame` 的补间动画控制器，支持缓动、循环与事件。

```ts
import { Tween } from '@fexd/tools'
```

## 适用场景

- 数字型属性动画（宽度、位移、透明度等从起始值过渡到目标值）
- 需要缓动曲线控制的交互动画（弹窗展开、滑动回弹等）
- 需要 `update`/`end` 等事件回调的补间动画
- 需要反向播放或循环播放的动画

## 不适用场景

- 非数字型属性动画（颜色渐变、CSS transform 多属性组合等需自行处理）
- 需要时间线编排多段动画（Tween 为单段补间，不支持序列）
- 非浏览器环境（依赖 requestAnimationFrame）

## 签名

```ts
interface Config {
  from?: number
  to?: number
  duration?: number
  ease?: EasingFunction
  loop?: boolean
}

class Tween {
  static DEFAULT_CONFIG: Config
  constructor(config?: Config)
  config(config?: Config): this
  on(event: 'start' | 'stop' | 'reverse' | 'end', listener: () => void): this
  on(
    event: 'update',
    listener: (value: number, prevValue: number) => void
  ): this
  off(event: string, listener: Function): this
  start(): this
  stop(): this
  restart(): this
  reset(): this
  reverse(): this
  progress(progress: number): this
  value(progress?: number): number
  isEnded(progress?: number): boolean
}
```

## 用法

```ts
import { Tween, easing } from '@fexd/tools'

const tween = new Tween({
  from: 0,
  to: 100,
  duration: 800,
  ease: easing.outCubic,
})
  .on('update', (v) => {
    box.style.width = `${v}px`
  })
  .on('end', () => console.log('done'))
  .start()

tween.reverse() // 反向播放
tween.stop()
```

## 注意事项

- 默认 `from: 0, to: 1, duration: 1000`，ease 为线性
- `loop: true` 结束时自动反转方向，不触发 `end`
- 已在运行或已结束时 `start()` 无效
- 内部使用 `FrameProcess.defaultProcess` 驱动帧更新

## 相关函数

- `easing` — 提供 50+ 缓动函数，可作为 Tween 的 ease 参数
- `FrameProcess` — Tween 底层使用的帧调度器
