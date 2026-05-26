import createCachedRequest from '../createCachedRequest'

describe('createCachedRequest', () => {
  test('缓存相同参数的调用结果', async () => {
    let callCount = 0
    const request = (id: number) => {
      callCount++
      return Promise.resolve({ id, value: id * 2 })
    }
    const cached = createCachedRequest(request)

    const r1 = await cached(1)
    const r2 = await cached(1)
    const r3 = await cached(1)

    expect(r1).toEqual({ id: 1, value: 2 })
    expect(r2).toEqual(r1)
    expect(r3).toEqual(r1)
    expect(callCount).toBe(1)
  })

  test('不同参数分别缓存', async () => {
    let callCount = 0
    const request = (id: number) => {
      callCount++
      return Promise.resolve(id * 2)
    }
    const cached = createCachedRequest(request)

    await cached(1)
    await cached(2)
    await cached(1)
    await cached(2)

    expect(callCount).toBe(2)
  })

  test('返回带 cache 属性的函数', () => {
    const request = (id: number) => Promise.resolve(id)
    const cached = createCachedRequest(request)
    expect(cached).toHaveProperty('cache')
    expect(cached.cache).toBeInstanceOf(Map)
  })

  test('默认缓存命中返回同一 Promise', () => {
    const request = (id: number) => Promise.resolve(id)
    const cached = createCachedRequest(request)
    const r1 = cached(1)
    const r2 = cached(1)
    expect(r1).toBe(r2)
  })

  test('缓存过期后重新请求', async () => {
    jest.useFakeTimers()
    let callCount = 0
    const request = (id: number) => {
      callCount++
      return Promise.resolve(id * 10)
    }
    const cached = createCachedRequest(request, { cacheMinutes: 1 })

    const r1 = cached(1)
    await r1
    expect(callCount).toBe(1)

    jest.advanceTimersByTime(61_000)

    const r2 = cached(1)
    await r2
    expect(callCount).toBe(2)

    jest.useRealTimers()
  })

  test('请求失败后缓存被清除，重试可成功', async () => {
    let callCount = 0
    const request = (id: number) => {
      callCount++
      if (callCount === 1) return Promise.reject(new Error('fail'))
      return Promise.resolve(id)
    }
    const cached = createCachedRequest(request)

    await expect(cached(1)).rejects.toThrow('fail')
    expect(callCount).toBe(1)

    const r2 = await cached(1)
    expect(callCount).toBe(2)
    expect(r2).toBe(1)
  })
})
