import capitalize from '../capitalize'

describe('capitalize', () => {
  test('首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  test('单字符', () => {
    expect(capitalize('a')).toBe('A')
  })

  test('空字符串', () => {
    expect(capitalize('')).toBe('')
  })

  test('已经是大写', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  test('全大写保持不变', () => {
    expect(capitalize('HELLO')).toBe('HELLO')
  })

  test('保留后续字符不变', () => {
    expect(capitalize('hELLO')).toBe('HELLO')
  })

  test('多个单词 - 每个单词首字母大写', () => {
    expect(capitalize('hello world')).toBe('Hello World')
  })

  test('多个空格分隔', () => {
    expect(capitalize('a b c')).toBe('A B C')
  })

  test('非字符串输入返回空字符串', () => {
    expect(capitalize(123 as any)).toBe('')
    expect(capitalize(null as any)).toBe('')
    expect(capitalize(undefined as any)).toBe('')
    expect(capitalize({} as any)).toBe('')
    expect(capitalize([] as any)).toBe('')
  })

  test('包含数字', () => {
    expect(capitalize('1abc')).toBe('1abc')
  })

  test('首字符为空格', () => {
    expect(capitalize(' hello')).toBe(' Hello')
  })

  test('连续空格', () => {
    expect(capitalize('hello  world')).toBe('Hello  World')
  })

  test('仅空格', () => {
    expect(capitalize('   ')).toBe('   ')
  })
})
