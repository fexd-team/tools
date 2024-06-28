import isNumberString from '../isNumberString'

describe('isNumberString', () => {
  test('isNumberString 正常工作', () => {
    // 字符串测试
    expect(isNumberString('1000')).toBe(true)
    expect(isNumberString('0.01')).toBe(true)
    expect(isNumberString('1000.01')).toBe(true)
    expect(isNumberString('1,000')).toBe(false)
    expect(isNumberString('1000.')).toBe(false)
    expect(isNumberString('0..01')).toBe(false)
    expect(isNumberString('1000..01')).toBe(false)
    expect(isNumberString('.01')).toBe(false)
    expect(isNumberString('1,000.01')).toBe(false)
    // 其他类型测试
    expect(isNumberString(1000)).toBe(false)
    expect(isNumberString(true)).toBe(false)
    expect(isNumberString([])).toBe(false)
    expect(isNumberString({})).toBe(false)
  })
})
