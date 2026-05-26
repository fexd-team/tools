import EventBus from '../EventBus'

describe('EventBus', () => {
  let bus: EventBus

  beforeEach(() => {
    bus = new EventBus()
  })

  test('on 和 emit - 基本事件监听和触发', () => {
    const listener = jest.fn()
    bus.on('test', listener)
    bus.emit('test')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('emit 传递参数', () => {
    const listener = jest.fn()
    bus.on('test', listener)
    bus.emit('test', 'a', 'b', 123)
    expect(listener).toHaveBeenCalledWith('a', 'b', 123)
  })

  test('多个监听器', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    bus.on('test', listener1)
    bus.on('test', listener2)
    bus.emit('test')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  test('off 移除监听器', () => {
    const listener = jest.fn()
    bus.on('test', listener)
    bus.off('test', listener)
    bus.emit('test')
    expect(listener).not.toHaveBeenCalled()
  })

  test('off 不传 listener 清除所有监听', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    bus.on('test', listener1)
    bus.on('test', listener2)
    bus.off('test')
    bus.emit('test')
    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).not.toHaveBeenCalled()
  })

  test('once 只触发一次', () => {
    const listener = jest.fn()
    bus.once('test', listener)
    bus.emit('test')
    bus.emit('test')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('once 触发后自动 off', () => {
    const listener = jest.fn()
    bus.once('test', listener)
    bus.emit('test', 'data')
    expect(listener).toHaveBeenCalledWith('data')
    bus.emit('test', 'data2')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('不同事件名互不干扰', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    bus.on('event1', listener1)
    bus.on('event2', listener2)
    bus.emit('event1')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).not.toHaveBeenCalled()
  })

  test('on 返回 this 可链式调用', () => {
    const listener = jest.fn()
    const result = bus.on('test', listener)
    expect(result).toBe(bus)
  })

  test('off 返回 this 可链式调用', () => {
    const listener = jest.fn()
    bus.on('test', listener)
    const result = bus.off('test', listener)
    expect(result).toBe(bus)
  })

  test('once 返回 this 可链式调用', () => {
    const listener = jest.fn()
    const result = bus.once('test', listener)
    expect(result).toBe(bus)
  })

  test('on 非 function 时打印错误并返回 this', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const result = bus.on('test', 'not a function' as any)
    expect(result).toBe(bus)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test('emit 没有监听器时不报错', () => {
    expect(() => bus.emit('nonexistent')).not.toThrow()
  })

  test('同一函数多次 on 只生效一次 (Map 特性)', () => {
    const listener = jest.fn()
    bus.on('test', listener)
    bus.on('test', listener)
    bus.emit('test')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('支持泛型事件名', () => {
    type Events = 'click' | 'hover'
    const typedBus = new EventBus<Events>()
    const listener = jest.fn()
    typedBus.on('click', listener)
    typedBus.emit('click')
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
