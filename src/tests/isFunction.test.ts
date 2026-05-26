import isFunction from '../isFunction'

describe('isFunction', () => {
  test('普通函数', () => {
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(() => {})).toBe(true)
  })

  test('异步函数', () => {
    expect(isFunction(async () => {})).toBe(true)
  })

  test('生成器函数', () => {
    expect(isFunction(function* () {})).toBe(true)
  })

  test('非函数', () => {
    expect(isFunction({})).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction(undefined)).toBe(false)
    expect(isFunction('function')).toBe(false)
    expect(isFunction(123)).toBe(false)
  })

  test('class 是函数', () => {
    class MyClass {}
    expect(isFunction(MyClass)).toBe(true)
  })
})
