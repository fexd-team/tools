import promiseGuess from '../promiseGuess'

describe('promiseGuess', () => {
  test('同步 executor 直接返回值', () => {
    const fn = promiseGuess(
      () => 42,
      (_err, value) => value * 2
    )
    expect(fn()).toBe(84)
  })

  test('异步 executor 返回 Promise', async () => {
    const fn = promiseGuess(
      () => Promise.resolve(42),
      (_err, value) => value * 2
    )
    const result = fn()
    expect(result).toBeInstanceOf(Promise)
    expect(await result).toBe(84)
  })

  test('异步 executor reject 时传 err', async () => {
    const fn = promiseGuess(
      () => Promise.reject(new Error('fail')),
      (err, value) => (err ? err.message : value)
    )
    expect(await fn()).toBe('fail')
  })

  test('异步 reject 时 value 为 undefined', async () => {
    const fn = promiseGuess(
      () => Promise.reject(new Error('err')),
      (err, value) => ({ err: !!err, value })
    )
    const result = await fn()
    expect(result.err).toBe(true)
    expect(result.value).toBeUndefined()
  })

  test('传递参数到 executor', () => {
    const fn = promiseGuess(
      (a: number, b: number) => a + b,
      (_err, value) => value
    )
    expect(fn(1, 2)).toBe(3)
  })

  test('valuer 接收额外参数', () => {
    const fn = promiseGuess(
      () => 10,
      (_err, value, extra: number) => value + extra
    )
    expect(fn(5)).toBe(15)
  })

  test('this 上下文传递', () => {
    const obj = {
      multiplier: 10,
      fn: promiseGuess(
        function (this: any) {
          return this.multiplier
        },
        function (this: any, _err: any, value: number) {
          return value * this.multiplier
        }
      ),
    }
    expect(obj.fn()).toBe(100)
  })

  test('同步 executor 返回非 Promise 非 thenable', () => {
    const fn = promiseGuess(
      () => 'string',
      (_err, value) => typeof value
    )
    expect(fn()).toBe('string')
  })

  test('executor 返回 thenable 对象', async () => {
    const fn = promiseGuess(
      () => ({
        then: (resolve: Function) => resolve('thenable'),
      }),
      (_err, value) => value
    )
    const result = fn()
    expect(result).toBeInstanceOf(Promise)
    expect(await result).toBe('thenable')
  })

  test('valuer 在异步 reject 时仍接收额外参数', async () => {
    const fn = promiseGuess(
      () => Promise.reject(new Error('fail')),
      (err, _value, extra: string) => extra
    )
    expect(await fn('extra_val')).toBe('extra_val')
  })
})
