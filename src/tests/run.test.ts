import run from '../run'

describe('run', () => {
  test('执行函数并返回结果', () => {
    expect(run(() => 42)).toBe(42)
  })

  test('通过字符串路径执行方法', () => {
    const obj = { fn: () => 'hello' }
    expect(run(obj, 'fn')).toBe('hello')
  })

  test('传递参数', () => {
    const obj = { add: (a: number, b: number) => a + b }
    expect(run(obj, 'add', 1, 2)).toBe(3)
  })

  test('非函数值直接返回', () => {
    expect(run({ a: 1 }, 'a')).toBe(1)
  })

  test('keys 为空数组时返回 obj 本身', () => {
    const obj = { a: 1 }
    expect(run(obj)).toBe(obj)
  })

  test('路径不存在返回 undefined', () => {
    expect(run({}, 'a.b.c')).toBeUndefined()
  })

  test('数组路径', () => {
    const obj = { a: { b: () => 'deep' } }
    expect(run(obj, ['a', 'b'])).toBe('deep')
  })

  test('this 上下文正确', () => {
    const obj = {
      value: 10,
      getValue: function () {
        return this.value
      },
    }
    expect(run(obj, 'getValue')).toBe(10)
  })

  test('obj 为 null 或 undefined 时安全处理', () => {
    expect(run(null)).toBe(null)
    expect(run(undefined)).toBe(undefined)
  })

  test('obj 为函数时直接调用', () => {
    const fn = jest.fn(() => 'result')
    expect(run(fn)).toBe('result')
    expect(fn).toHaveBeenCalled()
  })
})
