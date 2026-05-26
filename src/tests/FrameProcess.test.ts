import Process from '../FrameProcess'
import Thread from '../FrameProcess/core/Thread'

describe('Thread', () => {
  test('isAvailable 在未满时返回 true', () => {
    const thread = new Thread({ maxTaskCount: 2 })
    expect(thread.isAvailable()).toBe(true)
  })

  test('默认 maxTaskCount 为 20', () => {
    const thread = new Thread()
    expect(thread.maxTaskCount).toBe(20)
  })

  test('run 返回 stop 函数可移除任务', () => {
    const thread = new Thread()
    const stop = thread.run(() => {})
    expect(thread.taskList.size).toBe(1)
    stop()
    expect(thread.taskList.size).toBe(0)
  })

  test('任务数达到上限时 isAvailable 返回 false', () => {
    const thread = new Thread({ maxTaskCount: 1 })
    thread.run(() => {})
    expect(thread.isAvailable()).toBe(false)
  })
})

describe('Process', () => {
  test('getAvailableThread 返回可用线程', () => {
    const process = new Process()
    const thread = process.getAvailableThread()
    expect(thread).toBeInstanceOf(Thread)
  })

  test('线程满后创建新线程', () => {
    const process = new Process({ maxTaskCount: 1 })
    process.start(() => {})
    process.start(() => {})
    expect(process.threadList.length).toBe(2)
  })

  test('defaultProcess 静态实例', () => {
    expect(Process.defaultProcess).toBeInstanceOf(Process)
  })

  test('once 方法创建任务', () => {
    const process = new Process()
    const sizeBefore = process.threadList.reduce(
      (n, t) => n + t.taskList.size,
      0
    )
    process.once(() => {})
    const sizeAfter = process.threadList.reduce(
      (n, t) => n + t.taskList.size,
      0
    )
    expect(sizeAfter).toBeGreaterThan(sizeBefore)
  })
})
