import value from '../value'

describe('value', () => {
  test('返回第一个非 undefined 的值', () => {
    expect(value(undefined, 1, 2)).toBe(1)
  })

  test('所有值都为 undefined 时返回 undefined', () => {
    expect(value(undefined, undefined)).toBeUndefined()
  })

  test('第一个值有效直接返回', () => {
    expect(value(1, 2, 3)).toBe(1)
  })

  test('空参数返回 undefined', () => {
    expect(value()).toBeUndefined()
  })

  test('函数值会被执行', () => {
    expect(value(() => 42)).toBe(42)
  })

  test('undefined 后面的函数会被执行', () => {
    expect(value(undefined, () => 'hello')).toBe('hello')
  })

  test('falsy 值 0 有效', () => {
    expect(value(0, 1)).toBe(0)
  })

  test('falsy 值空字符串有效', () => {
    expect(value('', 'default')).toBe('')
  })

  test('null 值有效', () => {
    expect(value(null, 'default')).toBeNull()
  })

  test('false 值有效', () => {
    expect(value(false, true)).toBe(false)
  })
})
