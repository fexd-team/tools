import singleflight from '../singleflight'

describe('singleflight', () => {
  test('首次调用正常执行', async () => {
    const query = jest.fn(() => Promise.resolve('result'))
    const sf = singleflight(query)
    const result = await sf()
    expect(result).toBe('result')
    expect(query).toHaveBeenCalledTimes(1)
  })

  test('锁定期间再次调用返回相同结果（合并请求）', async () => {
    let resolveFirst: Function
    const query = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        })
    )
    const sf = singleflight(query)

    const promise1 = sf()
    const promise2 = sf()

    resolveFirst!('result')
    const [r1, r2] = await Promise.all([promise1, promise2])
    expect(r1).toBe('result')
    expect(r2).toBe('result')
    expect(query).toHaveBeenCalledTimes(1)
  })

  test('解锁后可再次调用', async () => {
    const query = jest.fn(() => Promise.resolve('result'))
    const sf = singleflight(query)
    await sf()
    expect(query).toHaveBeenCalledTimes(1)

    await sf()
    expect(query).toHaveBeenCalledTimes(2)
  })

  test('错误时自动解锁', async () => {
    const query = jest.fn(() => Promise.reject(new Error('fail')))
    const sf = singleflight(query)

    await expect(sf()).rejects.toThrow('fail')
    expect(query).toHaveBeenCalledTimes(1)

    await expect(sf()).rejects.toThrow('fail')
    expect(query).toHaveBeenCalledTimes(2)
  })

  test('多个并发调用共享同一 Promise', async () => {
    let resolveFn: Function
    const query = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve
        })
    )
    const sf = singleflight(query)

    const p1 = sf()
    const p2 = sf()
    const p3 = sf()

    resolveFn!('shared')
    const [r1, r2, r3] = await Promise.all([p1, p2, p3])
    expect(r1).toBe('shared')
    expect(r2).toBe('shared')
    expect(r3).toBe('shared')
    expect(query).toHaveBeenCalledTimes(1)
  })

  test('返回函数具有 unlock 方法', () => {
    const sf = singleflight(() => Promise.resolve())
    expect(typeof sf.unlock).toBe('function')
  })

  test('返回函数具有 isLocked 方法', () => {
    const sf = singleflight(() => Promise.resolve())
    expect(typeof sf.isLocked).toBe('function')
  })

  test('isLocked 正确反映锁定状态', async () => {
    let resolveFn: Function
    const query = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve
        })
    )
    const sf = singleflight(query)

    expect(sf.isLocked()).toBe(false)
    const p = sf()
    expect(sf.isLocked()).toBe(true)

    resolveFn!('done')
    await p
    expect(sf.isLocked()).toBe(false)
  })
})
