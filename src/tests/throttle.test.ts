import throttle from '../throttle'

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('首次调用立即执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('节流期间不执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('节流时间过后可再次执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled()
    jest.advanceTimersByTime(100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('节流期间最后一次调用在延迟后执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled('first')
    jest.advanceTimersByTime(50)
    throttled('second')
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('传递参数', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled('a', 'b')
    expect(fn).toHaveBeenCalledWith('a', 'b')
  })

  test('默认 wait 为 16ms', () => {
    const fn = jest.fn()
    const throttled = throttle(fn)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(15)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('this 上下文正确传递', () => {
    const obj = {
      value: 42,
      method: throttle(function (this: any) {
        return this.value
      }, 100),
    }
    const fn = jest.fn()
    obj.method = throttle(fn, 100) as any
    obj.method()
    expect(fn.mock.instances[0]).toBe(obj)
  })

  test('连续多次调用只有首次和最后一次执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled(1)
    throttled(2)
    throttled(3)
    throttled(4)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)

    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(4)
  })

  test('不同间隔的多次调用', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)

    throttled('a')
    jest.advanceTimersByTime(100)
    throttled('b')
    jest.advanceTimersByTime(100)
    throttled('c')

    expect(fn).toHaveBeenCalledTimes(3)
  })
})
