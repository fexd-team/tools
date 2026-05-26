# easing

缓动函数集合，提供 40+ 种缓动曲线。每个函数接收 `position`（0~1）并返回缓动后的值。

## 类型签名

```ts
type EasingFunction = (position: number, ...args: any[]) => number
interface EasingFunctionMap { [key: string]: EasingFunction }

const easing: EasingFunctionMap
```

## 内置缓动函数

| 类别 | 函数 |
|------|------|
| 线性 | `linear`, `none`, `full` |
| 二次 | `inQuad`, `outQuad`, `inOutQuad`, `outInQuad` |
| 三次 | `inCubic`, `outCubic`, `inOutCubic`, `outInCubic` |
| 四次 | `inQuart`, `outQuart`, `inOutQuart`, `outInQuart` |
| 五次 | `inQuint`, `outQuint`, `inOutQuint`, `outInQuint` |
| 正弦 | `inSine`, `outSine`, `inOutSine`, `outInSine`, `sinusoidal` |
| 指数 | `inExpo`, `outExpo`, `inOutExpo`, `outInExpo` |
| 圆形 | `inCirc`, `outCirc`, `inOutCirc`, `outInCirc` |
| 弹性 | `inElastic`, `outElastic`, `inOutElastic`, `outInElastic`, `elastic` |
| 回弹 | `inBack`, `outBack`, `inOutBack`, `outInBack` |
| 弹跳 | `inBounce`, `outBounce`, `inOutBounce`, `outInBounce`, `bounce` |
| 特殊 | `reverse`, `mirror`, `flicker`, `wobble`, `pulse`, `blink`, `spring`, `swingFromTo`, `swingFrom`, `swingTo`, `fromTo`, `from`, `to` |

## 示例

### 缓动曲线画廊

```jsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { easing, Tween } from '@fexd/tools'

const SKIP = ['reverse', 'mirror', 'flicker', 'wobble', 'pulse', 'blink', 'fromTo', 'from', 'to', 'none', 'full']
const ALL_CURVES = Object.keys(easing).filter((k) => !SKIP.includes(k))
const SPEED_PRESETS = [
  { label: '0.25x', value: 6000 },
  { label: '0.5x', value: 3000 },
  { label: '1x', value: 1500 },
  { label: '2x', value: 750 },
  { label: '3x', value: 500 },
]

const getRange = (easeFn) => {
  let min = 0, max = 1
  for (let i = 0; i <= 200; i++) {
    const v = easeFn(i / 200)
    if (v < min) min = v
    if (v > max) max = v
  }
  const margin = (max - min) * 0.12 || 0.05
  return { min: min - margin, max: max + margin }
}

const rangeCache = {}
const getCachedRange = (name, easeFn) => {
  if (!rangeCache[name]) rangeCache[name] = getRange(easeFn)
  return rangeCache[name]
}

const drawFrame = (canvas, easeFn, progress, range) => {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const padX = 8
  const padY = 6
  const pw = w - padX * 2
  const ph = h - padY * 2
  const { min, max } = range
  const span = max - min

  const valToY = (v) => padY + ((max - v) / span) * ph

  ctx.clearRect(0, 0, w, h)

  ctx.strokeStyle = '#f0f0f0'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ;[0, 1].forEach((v) => {
    const y = valToY(v)
    if (y >= padY - 1 && y <= h - padY + 1) {
      ctx.beginPath()
      ctx.moveTo(padX, y)
      ctx.lineTo(w - padX, y)
      ctx.stroke()
    }
  })
  ctx.setLineDash([])

  ctx.strokeStyle = '#e8e8e8'
  ctx.beginPath()
  ctx.moveTo(padX, valToY(0))
  ctx.lineTo(w - padX, valToY(1))
  ctx.stroke()

  ctx.strokeStyle = '#1890ff'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= 80; i++) {
    const t = i / 80
    const x = padX + t * pw
    const y = valToY(easeFn(t))
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()

  if (progress >= 0) {
    const dotX = padX + progress * pw
    const dotY = valToY(easeFn(progress))
    ctx.beginPath()
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#ff4d4f'
    ctx.fill()
  }
}

const CurveCard = ({ name, duration, playing }) => {
  const ref = useRef(null)
  const tweenRef = useRef(null)

  useEffect(() => {
    const fn = easing[name]
    if (!ref.current || !fn) return
    if (tweenRef.current) tweenRef.current.stop()

    const range = getCachedRange(name, fn)
    drawFrame(ref.current, fn, 0, range)

    if (playing) {
      const tween = new Tween({ duration, loop: true })
        .on('update', (v) => drawFrame(ref.current, fn, v, range))
        .start()
      tweenRef.current = tween
    }

    return () => { if (tweenRef.current) tweenRef.current.stop() }
  }, [name, duration, playing])

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={ref} width={140} height={110} style={{ border: '1px solid #f0f0f0', borderRadius: 6 }} />
      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{name}</div>
    </div>
  )
}

export default () => {
  const [speedIdx, setSpeedIdx] = useState(2)
  const [playing, setPlaying] = useState(true)
  const duration = SPEED_PRESETS[speedIdx].value

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 16, padding: '8px 12px',
        background: '#fafafa', borderRadius: 8, flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            border: '1px solid #d9d9d9', borderRadius: 6,
            padding: '4px 14px', cursor: 'pointer', fontSize: 14,
            background: playing ? '#fff' : '#1890ff', color: playing ? '#333' : '#fff',
          }}
        >{playing ? '⏸ 暂停' : '▶ 播放'}</button>

        <span style={{ fontSize: 13, color: '#999' }}>速度</span>
        {SPEED_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setSpeedIdx(i)}
            style={{
              border: '1px solid', borderRadius: 4,
              borderColor: i === speedIdx ? '#1890ff' : '#d9d9d9',
              background: i === speedIdx ? '#e6f7ff' : '#fff',
              color: i === speedIdx ? '#1890ff' : '#666',
              padding: '2px 10px', cursor: 'pointer', fontSize: 12,
            }}
          >{p.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {ALL_CURVES.map((name) => (
          <CurveCard key={name} name={name} duration={duration} playing={playing} />
        ))}
      </div>
    </div>
  )
}
```

### 代码用法

```ts
import { easing, Tween } from '@fexd/tools'

// 直接使用缓动函数
easing.inQuad(0.5)     // => 0.25
easing.outBounce(0.5)  // => 0.5
easing.linear(0.5)     // => 0.5

// 配合 Tween 动画
const tween = new Tween({
  from: 0,
  to: 100,
  duration: 1000,
  ease: easing.outCubic,
})

// 特殊函数
easing.reverse(0.3, easing.inQuad)  // 反转缓动
easing.mirror(0.3, easing.linear)    // 镜像缓动
easing.pulse(0.5, 3)                // 脉冲效果
easing.spring(0.5)                  // 弹簧效果
```

## 注意

- `position` 参数范围为 0~1，表示动画进度。
- `reverse`、`mirror`、`pulse` 等部分函数接受额外参数。
- 通常配合 `Tween` 驱动补间动画。

## 另见

- [`Tween`](./Tween) — 补间动画控制器
- [`FrameProcess`](../渲染/FrameProcess) — 帧任务调度器