import classnames from '../classnames'

describe('classnames', () => {
  test('多个字符串参数', () => {
    expect(classnames('a', 'b', 'c')).toBe('a b c')
  })

  test('对象参数 - truthy 值包含', () => {
    expect(classnames({ a: true, b: false, c: true })).toBe('a c')
  })

  test('数组参数', () => {
    expect(classnames(['a', 'b'])).toBe('a b')
  })

  test('混合参数', () => {
    expect(classnames('a', { b: true, c: false }, ['d', 'e'])).toBe('a b d e')
  })

  test('空参数', () => {
    expect(classnames()).toBe('')
  })

  test('空字符串参数被忽略', () => {
    expect(classnames('a', '', 'b')).toBe('a b')
  })

  test('falsy 值被忽略', () => {
    expect(classnames(null, undefined, false, 0, 'a')).toBe('a')
  })

  test('classnames 库直接拼接', () => {
    expect(classnames('a', 'a')).toBe('a a')
  })
})
