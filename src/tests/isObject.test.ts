import isObject from '../isObject'

describe('isObject', () => {
  test('普通对象', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
  })

  test('数组不是对象', () => {
    expect(isObject([])).toBe(false)
    expect(isObject([1, 2])).toBe(false)
  })

  test('null 不是对象', () => {
    expect(isObject(null)).toBe(false)
  })

  test('非对象值', () => {
    expect(isObject(undefined)).toBe(false)
    expect(isObject(123)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
  })

  test('Date 是对象', () => {
    expect(isObject(new Date())).toBe(true)
  })

  test('RegExp 是对象', () => {
    expect(isObject(/test/)).toBe(true)
  })

  test('函数不是对象', () => {
    expect(isObject(() => {})).toBe(false)
  })
})
