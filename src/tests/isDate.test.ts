import isDate from '../isDate'

describe('isDate', () => {
  test('Date 对象', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date('2024-01-01'))).toBe(true)
  })

  test('Invalid Date 也是 Date', () => {
    expect(isDate(new Date('invalid'))).toBe(true)
  })

  test('非 Date 值', () => {
    expect(isDate('2024-01-01')).toBe(false)
    expect(isDate(1704067200000)).toBe(false)
    expect(isDate({})).toBe(false)
    expect(isDate(null)).toBe(false)
  })
})
