# Tween

补间动画控制器，在两个数值间使用缓动函数进行平滑过渡。

## 类型签名

```ts
import { Tween } from '@fexd/tools'

interface TweenConfig {
  from?: number // default: 0
  to?: number // default: 1
  duration?: number // default: 1000
  ease?: EasingFunction // default: (pos) => pos (linear)
  loop?: boolean // default: false
}

type TweenEventTypes = 'start' | 'stop' | 'reverse' | 'update' | 'end'

class Tween {
  constructor(config?: TweenConfig)
  on(event: TweenEventTypes, listener: Function): this
  off(event: TweenEventTypes, listener?: Function): this
  config(config: TweenConfig): this
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

## 交互演示

### 数值动画

```jsx
import React, { useState } from 'react'
import { Tween, easing } from '@fexd/tools'

const TARGET = 996

export default () => {
  const [num, setNum] = useState(0)

  const [tween] = useState(() => {
    return new Tween({
      from: 0,
      to: TARGET,
      duration: 1200,
    })
      .on('update', (v) => setNum(Math.round(v)))
      .start()
  })

  return (
    <div>
      <h2 style={{ fontSize: 48, margin: '16px 0', color: '#1890ff' }}>
        {num}
      </h2>
      <button onClick={() => tween.restart()}>Restart</button>
    </div>
  )
}
```

### 完整动画控制器

```jsx
import React, { useState, useRef, useCallback } from 'react'
import { Tween, easing, sample } from '@fexd/tools'

const EASING_NAMES = Object.keys(easing).filter(
  (k) =>
    ![
      'reverse',
      'mirror',
      'flicker',
      'wobble',
      'pulse',
      'blink',
      'fromTo',
      'from',
      'to',
      'none',
      'full',
    ].includes(k)
)

const btnStyle = {
  padding: '4px 12px',
  fontSize: 12,
  cursor: 'pointer',
  borderRadius: 4,
  border: '1px solid #d9d9d9',
}

export default () => {
  const progressRef = useRef(null)
  const [currentEase, setCurrentEase] = useState('outCubic')
  const [duration, setDuration] = useState(1200)
  const [isLoop, setIsLoop] = useState(true)
  const [progress, setProgress] = useState(0)

  const [tweens] = useState(() => {
    const x = new Tween({ from: 0, to: 300 })
    const y = new Tween({ from: 0, to: -30, ease: easing.outBack })
    const scale = new Tween({ from: 1, to: 2 })
    const rotate = new Tween({ from: 0, to: 360 })

    const main = new Tween({ duration: 1200, loop: true }).on('update', (p) => {
      setProgress(p)
      if (progressRef.current) progressRef.current.value = p * 100
    })

    return { main, x, y, scale, rotate }
  })

  const tw = tweens.main
  const { x, y, scale, rotate } = tweens

  const updateEase = useCallback((name) => {
    setCurrentEase(name)
    const fn = easing[name] || easing.linear
    x.config({ ease: fn })
    scale.config({ ease: fn })
    rotate.config({ ease: fn })
  }, [])

  const randomEasing = useCallback(() => {
    const name = sample(EASING_NAMES)
    updateEase(name)
    tw.restart()
  }, [])

  const toggleLoop = useCallback(() => {
    const next = !isLoop
    setIsLoop(next)
    tw.config({ loop: next })
  }, [isLoop])

  const faster = useCallback(() => {
    const d = Math.max(200, duration - 200)
    setDuration(d)
    tw.config({ duration: d })
  }, [duration])

  const slower = useCallback(() => {
    const d = duration + 200
    setDuration(d)
    tw.config({ duration: d })
  }, [duration])

  const xv = x.value(progress)
  const yv = y.value(progress)
  const sv = scale.value(progress)
  const rv = rotate.value(progress)

  return (
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>
        <strong>{duration}ms</strong> / <strong>{currentEase}</strong>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          ref={progressRef}
          type="range"
          defaultValue="0"
          min="0"
          max="100"
          style={{ width: '100%' }}
          onInput={(e) => {
            tw.stop()
            tw.progress(Number(e.target.value) / 100)
          }}
          onMouseUp={() => tw.start()}
        />
      </div>

      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #1890ff, #722ed1)',
          transform: `translateX(${xv}px) translateY(${yv}px) scale(${sv}) rotate(${rv}deg)`,
          margin: '16px 0 50px',
          transition: 'none',
        }}
      />

      <pre
        style={{
          background: '#f5f5f5',
          padding: 8,
          borderRadius: 4,
          fontSize: 11,
          color: '#690',
          margin: '0 0 12px',
        }}
      >
        {`translateX(${xv.toFixed(1)}px)  translateY(${yv.toFixed(1)}px)
scale(${sv.toFixed(2)})  rotate(${rv.toFixed(1)}deg)`}
      </pre>

      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}
      >
        <button style={btnStyle} onClick={() => tw.start()}>
          Start
        </button>
        <button style={btnStyle} onClick={() => tw.stop()}>
          Stop
        </button>
        <button style={btnStyle} onClick={() => tw.reset()}>
          Reset
        </button>
        <button style={btnStyle} onClick={() => tw.restart()}>
          Restart
        </button>
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}
      >
        <button style={btnStyle} onClick={faster}>
          Faster
        </button>
        <button style={btnStyle} onClick={slower}>
          Slow down
        </button>
        <button style={btnStyle} onClick={() => tw.reverse()}>
          Reverse
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <button style={btnStyle} onClick={randomEasing}>
          Random Easing
        </button>
        <button style={btnStyle} onClick={toggleLoop}>
          Toggle Loop: {String(isLoop)}
        </button>
      </div>
    </div>
  )
}
```

### AI 打字机效果

```jsx
import React, { useState, useRef, useCallback } from 'react'
import { Tween, easing } from '@fexd/tools'

const SAMPLE_TEXT =
  '你好！我是 AI 助手。Tween 可以控制文字逐字显示的节奏，配合缓动函数让打字速度从快到慢，模拟人类思考后作答的效果。这比固定间隔的 setInterval 更加自然流畅。'

export default () => {
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [easeName, setEaseName] = useState('outQuad')
  const [duration, setDuration] = useState(2000)
  const tweenRef = useRef(null)

  const start = useCallback(() => {
    tweenRef.current?.stop()
    setText('')
    setIsTyping(true)

    const tween = new Tween({
      from: 0,
      to: SAMPLE_TEXT.length,
      duration,
      ease: easing[easeName] || easing.linear,
    })
      .on('update', (val) => {
        setText(SAMPLE_TEXT.slice(0, Math.round(val)))
      })
      .on('end', () => setIsTyping(false))
      .start()

    tweenRef.current = tween
  }, [easeName, duration])

  const stop = () => {
    tweenRef.current?.stop()
    setIsTyping(false)
  }

  const btnStyle = {
    padding: '4px 12px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #d9d9d9',
  }

  return (
    <div>
      <div
        style={{
          minHeight: 80,
          padding: 16,
          borderRadius: 8,
          background: '#f6f8fa',
          border: '1px solid #e8e8e8',
          marginBottom: 12,
          fontSize: 14,
          lineHeight: 1.8,
        }}
      >
        {text}
        {isTyping && (
          <span
            style={{
              borderRight: '2px solid #1890ff',
              marginLeft: 2,
              animation: 'blink 1s steps(1) infinite',
            }}
          />
        )}
        {!text && !isTyping && (
          <span style={{ color: '#bbb' }}>点击「开始」查看打字机效果...</span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 8,
        }}
      >
        <button
          style={{
            ...btnStyle,
            background: '#1890ff',
            color: '#fff',
            border: '1px solid #1890ff',
          }}
          onClick={start}
        >
          {isTyping ? '重新开始' : '开始'}
        </button>
        <button style={btnStyle} onClick={stop} disabled={!isTyping}>
          停止
        </button>
        <select
          value={easeName}
          onChange={(e) => setEaseName(e.target.value)}
          style={{
            padding: '3px 8px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            fontSize: 12,
          }}
        >
          <option value="linear">linear（匀速）</option>
          <option value="outQuad">outQuad（先快后慢）</option>
          <option value="inQuad">inQuad（先慢后快）</option>
          <option value="inOutCubic">inOutCubic（慢-快-慢）</option>
          <option value="outExpo">outExpo（急停）</option>
        </select>
        <span style={{ fontSize: 12, color: '#666' }}>{duration}ms</span>
        <input
          type="range"
          min={500}
          max={5000}
          step={100}
          value={duration}
          onChange={(e) => setDuration(+e.target.value)}
          style={{ width: 100 }}
        />
      </div>

      <pre
        style={{
          background: '#f5f5f5',
          padding: 8,
          borderRadius: 4,
          fontSize: 11,
          color: '#690',
        }}
      >
        {`const tween = new Tween({
  from: 0,
  to: text.length,   // ${SAMPLE_TEXT.length} 个字符
  duration: ${duration},
  ease: easing.${easeName},
})
tween.on('update', (val) => {
  displayText = fullText.slice(0, Math.round(val))
})`}
      </pre>
    </div>
  )
}
```

## 构造参数

| 参数              | 类型             | 必填 | 默认值       | 说明             |
| ----------------- | ---------------- | ---- | ------------ | ---------------- |
| `config.from`     | `number`         | 否   | `0`          | 起始值           |
| `config.to`       | `number`         | 否   | `1`          | 目标值           |
| `config.duration` | `number`         | 否   | `1000`       | 动画时长（毫秒） |
| `config.ease`     | `EasingFunction` | 否   | `pos => pos` | 缓动函数         |
| `config.loop`     | `boolean`        | 否   | `false`      | 是否循环播放     |

## 实例方法

| 方法                    | 说明                                 |
| ----------------------- | ------------------------------------ |
| `on(event, listener)`   | 监听事件，支持链式调用               |
| `off(event, listener?)` | 移除事件监听                         |
| `config(config)`        | 更新配置                             |
| `start()`               | 开始动画                             |
| `stop()`                | 暂停动画                             |
| `restart()`             | 重置并开始动画                       |
| `reset()`               | 停止并重置进度（正向回 0，反向回 1） |
| `reverse()`             | 切换动画方向                         |
| `progress(n)`           | 设置进度（0~1），触发 `update` 事件  |
| `value(n?)`             | 计算指定进度下的缓动值               |
| `isEnded(n?)`           | 判断动画是否结束                     |

## 事件

| 事件      | 说明                                    |
| --------- | --------------------------------------- |
| `start`   | 动画开始                                |
| `stop`    | 动画暂停                                |
| `reverse` | 方向切换                                |
| `update`  | 每帧更新，回调参数 `(value, prevValue)` |
| `end`     | 动画结束（循环模式不触发）              |

## 示例

```ts
import { Tween, easing } from '@fexd/tools'

// 基本动画
const tween = new Tween({
  from: 0,
  to: 100,
  duration: 500,
  ease: easing.outCubic,
})

tween.on('update', (value) => {
  element.style.opacity = value / 100
})

tween.on('end', () => {
  console.log('animation done')
})

tween.start()

// 动态设置进度
tween.progress(0.5) // 跳到 50%
tween.value() // => 当前缓动值
tween.isEnded() // => false
```

## 注意

- `start()` 调用后动画才会开始，重复调用不会重新启动。
- `loop: true` 时，动画完成时自动切换方向（`reverse`），不会触发 `end` 事件。
- `progress(n)` 会立即触发 `update` 事件，可用于手动控制动画进度。

## 另见

- [`easing`](./easing) — 缓动函数集合
- [`FrameProcess`](../browser/FrameProcess) — 帧任务调度器
