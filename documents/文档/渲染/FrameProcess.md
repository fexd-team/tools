# FrameProcess

基于 `requestAnimationFrame` 的帧任务调度器，支持多线程和任务管理。

## 类型签名

```ts
class FrameProcess {
  constructor(config?: { maxTaskCount?: number })
  start(frame: Function): Function  // 返回取消函数
  once(frame: Function): void
}

// 默认导出类，同时导出预创建的单例
export const defaultProcess: FrameProcess
export default FrameProcess
```

## 方法

| 方法 | 说明 |
|------|------|
| `start(frame)` | 启动帧循环任务，返回取消函数 |
| `once(frame)` | 执行一次帧任务后自动停止 |

## frame 回调参数

```ts
{
  runningTime: number  // 总运行时间
  startTime: number    // 任务开始时间戳
  frameTime: number    // 当前帧时间
}
```

## 示例

```ts
import { FrameProcess } from '@fexd/tools'

// 使用预创建的单例实例
const stop = FrameProcess.defaultProcess.start(({ runningTime }) => {
  element.style.transform = `translateX(${runningTime * 0.1}px)`
})

// 取消动画
stop()

// 执行一次帧任务
FrameProcess.defaultProcess.once(({ frameTime }) => {
  console.log('frame time:', frameTime)
})

// 也可以创建独立实例
const process = new FrameProcess({ maxTaskCount: 10 })
process.start(({ runningTime }) => { /* ... */ })
```

## 注意

- `FrameProcess` 是类，`FrameProcess.defaultProcess` 是预创建的静态单例实例。
- 每个线程默认最大支持 20 个并发任务。
- `maxTaskCount` 默认值为 20，超出时新任务需等待已有任务结束。

## 另见

- [`Tween`](../函数/Tween) — 补间动画控制器
- [`easing`](../函数/easing) — 缓动函数集合