import delay from '../delay'

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('延迟指定时间后 resolve', async () => {
    const spy = jest.fn()
    delay(100).then(spy)

    expect(spy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(100)

    await Promise.resolve()
    expect(spy).toHaveBeenCalled()
  })

  test('0ms 延迟立即 resolve', async () => {
    const spy = jest.fn()
    delay(0).then(spy)

    jest.advanceTimersByTime(0)
    await Promise.resolve()
    expect(spy).toHaveBeenCalled()
  })

  test('不传时间参数', async () => {
    const spy = jest.fn()
    delay().then(spy)

    jest.advanceTimersByTime(0)
    await Promise.resolve()
    expect(spy).toHaveBeenCalled()
  })

  test('Infinity 永远不 resolve', () => {
    const spy = jest.fn()
    delay(Infinity).then(spy)

    jest.advanceTimersByTime(999999)
    expect(spy).not.toHaveBeenCalled()
  })

  test('多次 advance 时间后 resolve', async () => {
    const spy = jest.fn()
    delay(200).then(spy)

    jest.advanceTimersByTime(100)
    expect(spy).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    await Promise.resolve()
    expect(spy).toHaveBeenCalled()
  })
})
