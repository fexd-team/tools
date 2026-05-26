import isUndefined from '../isUndefined'

describe('isUndefined', () => {
  test('undefined 返回 true', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  test('声明但未赋值的变量', () => {
    let val
    expect(isUndefined(val)).toBe(true)
  })

  test('非 undefined 返回 false', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined(NaN)).toBe(false)
  })
})
