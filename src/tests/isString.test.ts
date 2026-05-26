import isString from '../isString'

describe('isString', () => {
  test('字符串', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
    expect(isString('123')).toBe(true)
  })

  test('模板字符串', () => {
    const name = 'world'
    expect(isString(`hello ${name}`)).toBe(true)
  })

  test('非字符串', () => {
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString({})).toBe(false)
  })

  test('String 对象不是 string', () => {
    expect(isString(new String('hello'))).toBe(false)
  })
})
