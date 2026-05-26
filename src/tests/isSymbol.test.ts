import isSymbol from '../isSymbol'

describe('isSymbol', () => {
  test('Symbol() → true', () => {
    expect(isSymbol(Symbol())).toBe(true)
  })

  test('Symbol("desc") → true', () => {
    expect(isSymbol(Symbol('desc'))).toBe(true)
  })

  test('Symbol.iterator → true', () => {
    expect(isSymbol(Symbol.iterator)).toBe(true)
  })

  test('字符串 "symbol" → false', () => {
    expect(isSymbol('symbol')).toBe(false)
  })

  test('数字 → false', () => {
    expect(isSymbol(42)).toBe(false)
  })

  test('null → false', () => {
    expect(isSymbol(null)).toBe(false)
  })

  test('undefined → false', () => {
    expect(isSymbol(undefined)).toBe(false)
  })

  test('对象 → false', () => {
    expect(isSymbol({})).toBe(false)
  })
})
