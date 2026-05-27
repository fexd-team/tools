# Tween

基于 `requestAnimationFrame` 的补间动画控制器，支持缓动、循环与事件。

```ts
import { Tween } from '@fexd/tools'
```

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
