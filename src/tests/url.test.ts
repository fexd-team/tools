import { allParam, generateParamStr } from '../url'

describe('url - allParam', () => {
  test('基础 key=value 解析', () => {
    expect(allParam('?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })

  test('单个参数', () => {
    expect(allParam('?name=hello')).toEqual({ name: 'hello' })
  })

  test('空 search 返回空对象', () => {
    expect(allParam('?')).toEqual({})
    expect(allParam('https://example.com')).toEqual({})
  })

  test('值中包含 =（Base64、JWT 等）', () => {
    expect(allParam('?token=abc==')).toEqual({ token: 'abc==' })
    expect(allParam('?data=a=b=c')).toEqual({ data: 'a=b=c' })
  })

  test('空值参数', () => {
    expect(allParam('?key=')).toEqual({ key: '' })
  })

  test('无值参数（无等号）', () => {
    expect(allParam('?flag')).toEqual({ flag: '' })
  })

  test('混合参数', () => {
    expect(allParam('?a=1&b=&c=x==&d')).toEqual({
      a: '1',
      b: '',
      c: 'x==',
      d: '',
    })
  })

  test('含编码字符的值', () => {
    const result = allParam('?name=hello%20world')
    expect(result.name).toBe('hello world')
  })
})

describe('url - generateParamStr', () => {
  test('基础对象转查询字符串', () => {
    const result = generateParamStr({ a: '1', b: '2' })
    expect(result).toContain('a=1')
    expect(result).toContain('b=2')
    expect(result.startsWith('?')).toBe(true)
  })
})
