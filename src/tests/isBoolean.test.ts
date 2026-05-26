import isBoolean from '../isBoolean'

describe('isBoolean', () => {
  test('true 和 false', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  test('Boolean 对象', () => {
    expect(isBoolean(new Boolean(true))).toBe(false)
  })

  test('非布尔值', () => {
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
    expect(isBoolean(undefined)).toBe(false)
  })
})
