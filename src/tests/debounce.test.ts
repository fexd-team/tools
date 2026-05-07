import debounce from '../debounce'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('延迟执行', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('多次调用只执行最后一次', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced(1)
    debounced(2)
    debounced(3)

    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
  })

  test('返回的 timer handle 可用于 clearTimeout', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    const timerId = debounced()
    expect(timerId).toBeDefined()

    clearTimeout(timerId)
    jest.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()
  })

  test('cancel 取消待执行的调用', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced.cancel()

    jest.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()
  })

  test('cancel 后可以重新调用', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced(1)
    debounced.cancel()
    jest.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()

    debounced(2)
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2)
  })

  test('cancel 多次调用不会报错', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced.cancel()
    debounced.cancel()
    debounced.cancel()
    expect(fn).not.toHaveBeenCalled()
  })

  test('连续调用会重置计时', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced()
    jest.advanceTimersByTime(50)
    debounced()
    jest.advanceTimersByTime(50)

    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('默认 wait 为 16ms', () => {
    const fn = jest.fn()
    const debounced = debounce(fn)

    debounced()
    jest.advanceTimersByTime(15)
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('this 上下文正确传递', () => {
    const obj = {
      value: 'hello',
      method: debounce(function (this: any) {
        return this.value
      }, 100),
    }

    const fn = jest.fn()
    obj.method = debounce(fn, 100)
    obj.method()
    jest.advanceTimersByTime(100)
    expect(fn.mock.instances[0]).toBe(obj)
  })

  test('间隔足够长的多次调用各自独立执行', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 100)

    debounced('first')
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('first')

    debounced('second')
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('second')
  })
})
