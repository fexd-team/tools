import isArray from '../isArray'

describe('isArray', () => {
  test('数组返回 true', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray(new Array())).toBe(true)
  })

  test('非数组返回 false', () => {
    expect(isArray({})).toBe(false)
    expect(isArray('string')).toBe(false)
    expect(isArray(123)).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(undefined)).toBe(false)
    expect(isArray(() => {})).toBe(false)
  })

  test('类数组对象不是数组', () => {
    expect(isArray({ 0: 'a', 1: 'b', length: 2 })).toBe(false)
  })

  test('使用 Array.isArray 实现，结果与原生一致', () => {
    const arr = [1, 2, 3]
    expect(isArray(arr)).toBe(Array.isArray(arr))
    expect(isArray({})).toBe(Array.isArray({}))
    expect(isArray(null)).toBe(Array.isArray(null))
  })
})
