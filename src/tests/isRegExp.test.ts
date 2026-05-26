import isRegExp from '../isRegExp'

describe('isRegExp', () => {
  test('正则表达式返回 true', () => {
    expect(isRegExp(/test/)).toBe(true)
    expect(isRegExp(new RegExp('test'))).toBe(true)
    expect(isRegExp(/^hello$/)).toBe(true)
    expect(isRegExp(new RegExp('\\d+', 'g'))).toBe(true)
  })

  test('非正则返回 false', () => {
    expect(isRegExp('test')).toBe(false)
    expect(isRegExp(42)).toBe(false)
    expect(isRegExp({})).toBe(false)
    expect(isRegExp([])).toBe(false)
    expect(isRegExp(null)).toBe(false)
    expect(isRegExp(undefined)).toBe(false)
    expect(isRegExp(true)).toBe(false)
    expect(isRegExp(() => {})).toBe(false)
  })

  test('类似正则的对象', () => {
    expect(isRegExp({ source: 'test', flags: 'g' })).toBe(false)
  })
})
