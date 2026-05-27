# FrameProcess

帧任务调度器，按线程池分配 `requestAnimationFrame` 任务并限制并发。

```ts
import { FrameProcess } from '@fexd/tools'
```

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
