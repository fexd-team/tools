import memoize from '../memoize'

describe('memoize', () => {
  test('缓存函数结果', () => {
    let callCount = 0
    const fn = memoize((key: string) => {
      callCount++
      return key.toUpperCase()
    })

    expect(fn('hello')).toBe('HELLO')
    expect(fn('hello')).toBe('HELLO')
    expect(callCount).toBe(1)
  })

  test('不同参数独立缓存', () => {
    let callCount = 0
    const fn = memoize((key: string) => {
      callCount++
      return key.toUpperCase()
    })

    fn('a')
    fn('b')
    expect(callCount).toBe(2)

    fn('a')
    expect(callCount).toBe(2)
  })

  test('暴露 cache 属性', () => {
    const fn = memoize((key: string) => key)
    fn('test')
    expect(fn.cache).toBeInstanceOf(Map)
    expect(fn.cache.has('test')).toBe(true)
    expect(fn.cache.get('test')).toBe('test')
  })

  test('手动清除缓存', () => {
    let callCount = 0
    const fn = memoize((key: string) => {
      callCount++
      return key
    })

    fn('a')
    expect(callCount).toBe(1)
    fn.cache.clear()
    fn('a')
    expect(callCount).toBe(2)
  })

  test('disable 选项控制缓存', () => {
    let callCount = 0
    const fn = memoize(
      (key: string) => {
        callCount++
        return key
      },
      { disable: () => true }
    )

    fn('a')
    fn('a')
    expect(callCount).toBe(2)
    expect(fn.cache.has('a')).toBe(false)
  })

  test('disable 返回 false 时正常缓存', () => {
    let callCount = 0
    const fn = memoize(
      (key: string) => {
        callCount++
        return key
      },
      { disable: () => false }
    )

    fn('a')
    fn('a')
    expect(callCount).toBe(1)
  })

  test('disable 接收 context 参数', () => {
    const disableFn = jest.fn().mockReturnValue(false)
    const fn = memoize((key: number) => key * 2, { disable: disableFn })
    fn(5)
    expect(disableFn).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 5,
        result: 10,
        cache: expect.any(Map),
        drop: expect.any(Function),
      })
    )
  })

  test('disable 的 drop 方法可删除缓存', () => {
    let callCount = 0
    const fn = memoize(
      (key: string) => {
        callCount++
        return key
      },
      {
        disable: ({ cache, key }) => {
          cache.delete(key)
          return true
        },
      }
    )

    fn('a')
    fn('a')
    expect(callCount).toBe(2)
  })

  test('多参数函数只有第一个参数作为缓存键', () => {
    let callCount = 0
    const fn = memoize((key: string, extra: string) => {
      callCount++
      return `${key}-${extra}`
    })

    fn('a', '1')
    fn('a', '2')
    expect(callCount).toBe(1)
    expect(fn('a', '2')).toBe('a-1')
  })
})
