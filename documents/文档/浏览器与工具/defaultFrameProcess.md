# defaultProcess

`FrameProcess` 类的静态单例实例，开箱即用。

## 说明

等同于 `new FrameProcess()`，预创建的共享实例，避免重复创建。通过 `FrameProcess.defaultProcess` 访问。

## 示例

```ts
import { FrameProcess } from '@fexd/tools'

const stop = FrameProcess.defaultProcess.start(({ runningTime }) => {
  console.log('running time:', runningTime)
})

// 取消
stop()
```

## 另见

- [`FrameProcess`](./FrameProcess) — 帧任务调度器
