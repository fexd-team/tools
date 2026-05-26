import isNaN from '../isNaN'

describe('isNaN', () => {
  test('NaN 返回 true', () => {
    expect(isNaN(NaN)).toBe(true)
  })

  test('非 NaN 返回 false', () => {
    expect(isNaN(0)).toBe(false)
    expect(isNaN(Infinity)).toBe(false)
    expect(isNaN(-Infinity)).toBe(false)
    expect(isNaN('NaN')).toBe(false)
    expect(isNaN(null)).toBe(false)
    expect(isNaN(undefined)).toBe(false)
  })

  test('Number.isNaN 的行为一致', () => {
    expect(isNaN(NaN)).toBe(Number.isNaN(NaN))
    expect(isNaN('hello')).toBe(Number.isNaN('hello'))
  })
})
