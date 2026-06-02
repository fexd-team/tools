# FrameProcess

帧任务调度器，按线程池分配 `requestAnimationFrame` 任务并限制并发。

```ts
import { FrameProcess } from '@fexd/tools'
```

## 适用场景

- 需要以 requestAnimationFrame 频率持续执行帧回调（动画、游戏循环等）
- 需要限制每帧并发任务数，防止过多动画抢占帧时间
- 需要在下一帧执行一次性回调（类似 rAF 版的 nextTick）

## 不适用场景

- 浏览器专用，依赖 requestAnimationFrame，Node.js 环境不可用
- 需要精确到毫秒级的定时调度（应使用 setTimeout/setInterval）
- 需要暂停/恢复帧循环（Process 仅提供 start/stop，无 pause）

## 签名

```ts
interface ThreadConfig {
  maxTaskCount?: number
}

class Process {
  static defaultProcess: Process
  constructor(config?: ThreadConfig)
  start(frame: (ctx: { frameTime: number }) => void): () => void
  once(frame: Function): void
}

export const defaultProcess: Process
export default Process
```

## 用法

```ts
import FrameProcess, { defaultProcess } from '@fexd/tools'

// 持续帧回调，返回 stop 函数
const stop = FrameProcess.defaultProcess.start(({ frameTime }) => {
  updateUI(frameTime)
})
stop()

// 单帧执行
defaultProcess.once(() => console.log('next frame'))

// 自定义进程实例
const process = new FrameProcess({ maxTaskCount: 10 })
```

## 注意事项

- `start` 返回停止函数，调用后取消该帧任务
- `once` 执行一帧后自动停止
- `Tween` 等内部依赖 `defaultProcess` 单例
- 通过 `Thread` 池控制每线程最大任务数

## 相关函数

- `Tween` — 内部依赖 FrameProcess.defaultProcess 驱动动画帧
- `easing` — 缓动函数集合，常与帧动画配合使用
- `nextTick` — 在下一帧执行回调的轻量工具
