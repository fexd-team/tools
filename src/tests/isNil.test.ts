import isNil from '../isNil'

describe('isNil', () => {
  test('null → true', () => {
    expect(isNil(null)).toBe(true)
  })

  test('undefined → true', () => {
    expect(isNil(undefined)).toBe(true)
  })

  test('void 0 → true', () => {
    expect(isNil(void 0)).toBe(true)
  })

  test('0 → false', () => {
    expect(isNil(0)).toBe(false)
  })

  test('空字符串 → false', () => {
    expect(isNil('')).toBe(false)
  })

  test('false → false', () => {
    expect(isNil(false)).toBe(false)
  })

  test('NaN → false', () => {
    expect(isNil(NaN)).toBe(false)
  })

  test('空对象 → false', () => {
    expect(isNil({})).toBe(false)
  })

  test('空数组 → false', () => {
    expect(isNil([])).toBe(false)
  })
})
