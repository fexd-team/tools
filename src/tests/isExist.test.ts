import isExist from '../isExist'

describe('isExist', () => {
  test('存在值返回 true', () => {
    expect(isExist(0)).toBe(true)
    expect(isExist('')).toBe(true)
    expect(isExist(false)).toBe(true)
    expect(isExist({})).toBe(true)
    expect(isExist([])).toBe(true)
  })

  test('null 返回 false', () => {
    expect(isExist(null)).toBe(false)
  })

  test('undefined 返回 false', () => {
    expect(isExist(undefined)).toBe(false)
  })

  test('NaN 存在', () => {
    expect(isExist(NaN)).toBe(true)
  })

  test('函数存在', () => {
    expect(isExist(() => {})).toBe(true)
  })

  test('Date 存在', () => {
    expect(isExist(new Date())).toBe(true)
  })

  test('Symbol 存在', () => {
    expect(isExist(Symbol('test'))).toBe(true)
  })
})
