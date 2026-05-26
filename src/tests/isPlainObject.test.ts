import isPlainObject from '../isPlainObject'

describe('isPlainObject', () => {
  test('普通对象返回 true', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  test('new Object() 返回 true', () => {
    expect(isPlainObject(new Object())).toBe(true)
  })

  test('数组返回 false', () => {
    expect(isPlainObject([1, 2, 3])).toBe(false)
    expect(isPlainObject([])).toBe(false)
  })

  test('null 和 undefined 返回 false', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
  })

  test('原始值返回 false', () => {
    expect(isPlainObject(42)).toBe(false)
    expect(isPlainObject('str')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
  })

  test('class 实例返回 false', () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false)
  })

  test('Date 实例返回 false', () => {
    expect(isPlainObject(new Date())).toBe(false)
  })

  test('RegExp 实例返回 false', () => {
    expect(isPlainObject(/test/)).toBe(false)
  })
})
