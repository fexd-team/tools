import isInteger from '../isInteger'

describe('isInteger', () => {
  test('0 → true', () => {
    expect(isInteger(0)).toBe(true)
  })

  test('1 → true', () => {
    expect(isInteger(1)).toBe(true)
  })

  test('-1 → true', () => {
    expect(isInteger(-1)).toBe(true)
  })

  test('Number.MAX_SAFE_INTEGER → true', () => {
    expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  test('1.5 → false', () => {
    expect(isInteger(1.5)).toBe(false)
  })

  test('Infinity → false', () => {
    expect(isInteger(Infinity)).toBe(false)
  })

  test('-Infinity → false', () => {
    expect(isInteger(-Infinity)).toBe(false)
  })

  test('NaN → false', () => {
    expect(isInteger(NaN)).toBe(false)
  })

  test('"1" → false', () => {
    expect(isInteger('1' as any)).toBe(false)
  })

  test('null → false', () => {
    expect(isInteger(null)).toBe(false)
  })

  test('true → false', () => {
    expect(isInteger(true as any)).toBe(false)
  })
})
