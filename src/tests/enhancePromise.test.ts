import enhancePromise from '../enhancePromise'

describe('enhancePromise', () => {
  test('初始状态为 pending', () => {
    const ep = enhancePromise()
    expect(ep.isPending()).toBe(true)
    expect(ep.isFulfilled()).toBe(false)
    expect(ep.isRejected()).toBe(false)
    expect(ep.isNotPending()).toBe(false)
  })

  test('resolve 后状态为 fulfilled', () => {
    const ep = enhancePromise()
    ep.resolve('success')

    expect(ep.isPending()).toBe(false)
    expect(ep.isFulfilled()).toBe(true)
    expect(ep.isRejected()).toBe(false)
    expect(ep.isNotPending()).toBe(true)
    expect(ep.getValue()).toBe('success')
  })

  test('reject 后状态为 rejected', async () => {
    const ep = enhancePromise()
    const error = new Error('fail')
    ep.reject(error)

    expect(ep.isPending()).toBe(false)
    expect(ep.isFulfilled()).toBe(false)
    expect(ep.isRejected()).toBe(true)
    expect(ep.getError()).toBe(error)

    try {
      await ep
    } catch (e) {}
  })

  test('isResolved 是 isFulfilled 的别名', () => {
    const ep = enhancePromise()
    expect(ep.isResolved).toBe(ep.isFulfilled)
  })

  test('resolve 后再 resolve 无效', () => {
    const ep = enhancePromise()
    ep.resolve('first')
    ep.resolve('second')
    expect(ep.getValue()).toBe('first')
    expect(ep.isFulfilled()).toBe(true)
  })

  test('resolve 后再 reject 无效', () => {
    const ep = enhancePromise()
    ep.resolve('value')
    ep.reject(new Error('fail'))
    expect(ep.isFulfilled()).toBe(true)
    expect(ep.getValue()).toBe('value')
  })

  test('reject 后再 resolve 无效', async () => {
    const ep = enhancePromise()
    ep.reject(new Error('fail'))
    ep.resolve('value')
    expect(ep.isRejected()).toBe(true)
    expect(ep.getError().message).toBe('fail')

    try {
      await ep
    } catch (e) {}
  })

  test('传入已 resolved 的 Promise', async () => {
    const ep = enhancePromise(Promise.resolve('hello'))
    await ep
    expect(ep.isFulfilled()).toBe(true)
    expect(ep.getValue()).toBe('hello')
  })

  test('传入已 rejected 的 Promise', async () => {
    const ep = enhancePromise(Promise.reject(new Error('oops')))
    try {
      await ep
    } catch (e) {}
    expect(ep.isRejected()).toBe(true)
    expect(ep.getError().message).toBe('oops')
  })

  test('getValue 在 pending 时返回 undefined', () => {
    const ep = enhancePromise()
    expect(ep.getValue()).toBeUndefined()
  })

  test('getError 在 pending 时返回 undefined', () => {
    const ep = enhancePromise()
    expect(ep.getError()).toBeUndefined()
  })

  test('enhancePromise 本身是 Promise', async () => {
    const ep = enhancePromise()
    ep.resolve(42)
    const result = await ep
    expect(result).toBe(42)
  })
})
