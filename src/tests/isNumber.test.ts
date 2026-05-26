import isNumber from '../isNumber'

describe('isNumber', () => {
  test('有效数字', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(42)).toBe(true)
    expect(isNumber(-1.5)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(-Infinity)).toBe(true)
  })

  test('NaN 不是有效数字', () => {
    expect(isNumber(NaN)).toBe(false)
  })

  test('非数字', () => {
    expect(isNumber('42')).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(Number('abc'))).toBe(false)
  })

  test('Number 对象不是 number 类型', () => {
    expect(isNumber(new Number(42))).toBe(false)
  })
})
