import { default as getClassNameArray } from '../classnames/getClassNameArray'

describe('getClassNameArray', () => {
  test('字符串参数', () => {
    expect(getClassNameArray('hello')).toEqual(['hello'])
  })

  test('包含空格的字符串拆分', () => {
    expect(getClassNameArray('hello world')).toEqual(['hello', 'world'])
  })

  test('对象参数 - truthy 值', () => {
    expect(getClassNameArray({ a: true, b: false, c: true })).toEqual([
      'a',
      'c',
    ])
  })

  test('数组参数递归', () => {
    expect(getClassNameArray(['a', 'b'])).toEqual(['a', 'b'])
  })

  test('混合参数', () => {
    expect(getClassNameArray('a', { b: true }, ['c'])).toEqual(['a', 'b', 'c'])
  })

  test('falsy 参数被过滤', () => {
    expect(getClassNameArray(null, undefined, 0, false, 'a')).toEqual(['a'])
  })

  test('数字转换为字符串', () => {
    expect(getClassNameArray(123 as any)).toEqual(['123'])
  })

  test('嵌套数组', () => {
    expect(getClassNameArray([['a', 'b'], 'c'])).toEqual(['a', 'b', 'c'])
  })

  test('空字符串被过滤', () => {
    expect(getClassNameArray('', 'a')).toEqual(['a'])
  })
})
