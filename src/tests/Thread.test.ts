import Thread from '../FrameProcess/core/Thread'
import Process from '../FrameProcess/core/Process'

describe('Thread', () => {
  test('isAvailable - 空线程应可用', () => {
    const thread = new Thread({ maxTaskCount: 2 })
    expect(thread.isAvailable()).toBe(true)
    expect(thread.taskList.size).toBe(0)
  })

  test('isAvailable - 未满线程应可用', () => {
    const thread = new Thread({ maxTaskCount: 3 })
    thread.run(() => {})
    expect(thread.taskList.size).toBe(1)
    expect(thread.isAvailable()).toBe(true)
  })

  test('isAvailable - 恰好满时应不可用', () => {
    const thread = new Thread({ maxTaskCount: 2 })
    thread.run(() => {})
    thread.run(() => {})
    expect(thread.taskList.size).toBe(2)
    expect(thread.isAvailable()).toBe(false)
  })

  test('isAvailable - maxTaskCount=1 边界', () => {
    const thread = new Thread({ maxTaskCount: 1 })
    expect(thread.isAvailable()).toBe(true)

    thread.run(() => {})
    expect(thread.isAvailable()).toBe(false)
  })

  test('run 返回的 stop 函数能移除任务并恢复可用', () => {
    const thread = new Thread({ maxTaskCount: 2 })
    const stop1 = thread.run(() => {})
    const stop2 = thread.run(() => {})
    expect(thread.taskList.size).toBe(2)
    expect(thread.isAvailable()).toBe(false)

    stop1()
    expect(thread.taskList.size).toBe(1)
    expect(thread.isAvailable()).toBe(true)

    stop2()
    expect(thread.taskList.size).toBe(0)
    expect(thread.isAvailable()).toBe(true)
  })

  test('stop 同一任务多次调用不会报错', () => {
    const thread = new Thread({ maxTaskCount: 2 })
    const stop = thread.run(() => {})
    stop()
    stop()
    expect(thread.taskList.size).toBe(0)
  })

  test('默认 maxTaskCount 为 20', () => {
    const thread = new Thread()
    expect(thread.maxTaskCount).toBe(20)
    expect(thread.isAvailable()).toBe(true)
  })
})

describe('Process', () => {
  test('getAvailableThread - 应复用未满线程', () => {
    const process = new Process({ maxTaskCount: 3 })
    process.start(() => {})
    process.start(() => {})
    expect(process.threadList.length).toBe(1)
    expect(process.threadList[0].taskList.size).toBe(2)
  })

  test('getAvailableThread - 线程满后应创建新线程', () => {
    const process = new Process({ maxTaskCount: 2 })
    process.start(() => {})
    process.start(() => {})
    expect(process.threadList.length).toBe(1)

    process.start(() => {})
    expect(process.threadList.length).toBe(2)
    expect(process.threadList[0].taskList.size).toBe(2)
    expect(process.threadList[1].taskList.size).toBe(1)
  })

  test('getAvailableThread - 释放任务后应复用已有线程', () => {
    const process = new Process({ maxTaskCount: 1 })
    const stop1 = process.start(() => {})
    expect(process.threadList.length).toBe(1)

    process.start(() => {})
    expect(process.threadList.length).toBe(2)

    stop1()
    process.start(() => {})
    expect(process.threadList.length).toBe(2)
  })

  test('getAvailableThread - 多线程逐步填满', () => {
    const process = new Process({ maxTaskCount: 1 })
    process.start(() => {})
    expect(process.threadList.length).toBe(1)

    process.start(() => {})
    expect(process.threadList.length).toBe(2)

    process.start(() => {})
    expect(process.threadList.length).toBe(3)
  })
})
