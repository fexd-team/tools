import isFinite from '../isFinite'

describe('isFinite', () => {
  test('0 → true', () => {
    expect(isFinite(0)).toBe(true)
  })

  test('1.5 → true', () => {
    expect(isFinite(1.5)).toBe(true)
  })

  test('-999 → true', () => {
    expect(isFinite(-999)).toBe(true)
  })

  test('Number.MAX_VALUE → true', () => {
    expect(isFinite(Number.MAX_VALUE)).toBe(true)
  })

  test('Infinity → false', () => {
    expect(isFinite(Infinity)).toBe(false)
  })

  test('-Infinity → false', () => {
    expect(isFinite(-Infinity)).toBe(false)
  })

  test('NaN → false', () => {
    expect(isFinite(NaN)).toBe(false)
  })

  test('"123" → false (不做类型转换)', () => {
    expect(isFinite('123' as any)).toBe(false)
  })

  test('null → false', () => {
    expect(isFinite(null)).toBe(false)
  })

  test('undefined → false', () => {
    expect(isFinite(undefined)).toBe(false)
  })

  test('true → false', () => {
    expect(isFinite(true as any)).toBe(false)
  })
})
