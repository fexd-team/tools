import isNull from '../isNull'

describe('isNull', () => {
  test('null 返回 true', () => {
    expect(isNull(null)).toBe(true)
  })

  test('非 null 返回 false', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
  })
})
