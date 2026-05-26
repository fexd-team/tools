import nextTick from '../nextTick'

describe('nextTick', () => {
  test('在下一次微任务中执行', async () => {
    const order: number[] = []
    order.push(1)
    nextTick(() => order.push(2))
    order.push(3)
    await Promise.resolve()
    expect(order).toEqual([1, 3, 2])
  })

  test('返回 Promise', async () => {
    const result = nextTick(() => 42)
    expect(result).toBeInstanceOf(Promise)
    await result
  })

  test('回调接收 undefined 参数', async () => {
    const fn = jest.fn()
    nextTick(fn)
    await Promise.resolve()
    expect(fn).toHaveBeenCalledWith(undefined)
  })
})
