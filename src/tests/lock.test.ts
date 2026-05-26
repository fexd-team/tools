import lock from '../lock'

describe('lock', () => {
  test('首次调用正常执行', () => {
    const fn = jest.fn(() => 42)
    const lockedFn = lock(fn)
    expect(lockedFn()).toBe(42)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('锁定后再次调用返回缓存结果', () => {
    let count = 0
    const fn = () => ++count
    const lockedFn = lock(fn)
    expect(lockedFn()).toBe(1)
    expect(lockedFn()).toBe(1)
    expect(lockedFn()).toBe(1)
  })

  test('unlock 后可再次执行', () => {
    let count = 0
    const fn = () => ++count
    const lockedFn = lock(fn)
    expect(lockedFn()).toBe(1)
    lockedFn.unlock()
    expect(lockedFn()).toBe(2)
  })

  test('isLocked 判断锁定状态', () => {
    const fn = () => 'result'
    const lockedFn = lock(fn)
    expect(lockedFn.isLocked()).toBe(false)
    lockedFn()
    expect(lockedFn.isLocked()).toBe(true)
    lockedFn.unlock()
    expect(lockedFn.isLocked()).toBe(false)
  })

  test('always 回调总是执行', () => {
    const always = jest.fn()
    const fn = jest.fn(() => 'result')
    const lockedFn = lock(fn, { always })
    lockedFn()
    expect(always).toHaveBeenCalledTimes(1)
    lockedFn()
    expect(always).toHaveBeenCalledTimes(2)
  })

  test('locking 回调在锁定时执行', () => {
    const locking = jest.fn()
    const fn = jest.fn(() => 'result')
    const lockedFn = lock(fn, { locking })
    lockedFn()
    expect(locking).not.toHaveBeenCalled()
    lockedFn()
    expect(locking).toHaveBeenCalledTimes(1)
  })

  test('lock.memory 访问内部 memoize', () => {
    expect(lock.memory).toBeDefined()
    expect(lock.memory.cache).toBeInstanceOf(Map)
  })

  test('unlock 多次不报错', () => {
    const fn = () => 'result'
    const lockedFn = lock(fn)
    lockedFn()
    lockedFn.unlock()
    lockedFn.unlock()
    expect(lockedFn.isLocked()).toBe(false)
  })

  test('锁定期间 always 每次都触发', () => {
    const always = jest.fn()
    const fn = () => 'result'
    const lockedFn = lock(fn, { always })
    lockedFn()
    lockedFn()
    lockedFn()
    expect(always).toHaveBeenCalledTimes(3)
  })

  test('锁定期间 locking 每次都触发', () => {
    const locking = jest.fn()
    const fn = () => 'result'
    const lockedFn = lock(fn, { locking })
    lockedFn()
    lockedFn()
    lockedFn()
    expect(locking).toHaveBeenCalledTimes(2)
  })

  test('不同函数独立锁定', () => {
    const fn1 = jest.fn(() => 'a')
    const fn2 = jest.fn(() => 'b')
    const locked1 = lock(fn1)
    const locked2 = lock(fn2)
    locked1()
    locked2()
    expect(locked1.isLocked()).toBe(true)
    expect(locked2.isLocked()).toBe(true)
    locked1.unlock()
    expect(locked1.isLocked()).toBe(false)
    expect(locked2.isLocked()).toBe(true)
  })
})
