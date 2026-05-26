import qs from '../qs'

describe('qs', () => {
  describe('parse', () => {
    test('基础解析', () => {
      expect(qs.parse('?a=1&b=2')).toEqual({ a: '1', b: '2' })
    })

    test('不带 ? 的字符串返回空对象', () => {
      expect(qs.parse('a=1&b=2')).toEqual({})
    })

    test('空字符串', () => {
      expect(qs.parse('')).toEqual({})
    })

    test('编码值自动解码', () => {
      expect(qs.parse('?name=hello%20world')).toEqual({ name: 'hello world' })
    })

    test('空值参数', () => {
      expect(qs.parse('?key=')).toEqual({ key: '' })
    })
  })

  describe('stringify', () => {
    test('基础序列化', () => {
      expect(qs.stringify({ a: '1', b: '2' })).toBe('a=1&b=2')
    })

    test('不以 ? 开头', () => {
      expect(qs.stringify({ a: '1' })).toBe('a=1')
    })

    test('空对象', () => {
      expect(qs.stringify({})).toBe('')
    })

    test('特殊字符被编码', () => {
      expect(qs.stringify({ url: 'http://example.com' })).toBe(
        'url=http%3A%2F%2Fexample.com'
      )
    })

    test('数值被转为字符串', () => {
      expect(qs.stringify({ count: 42 } as any)).toBe('count=42')
    })

    test('空字符串值', () => {
      expect(qs.stringify({ key: '' })).toBe('key=')
    })

    test('round-trip：parse(stringify) 等价', () => {
      const obj = { name: 'test', age: '25' }
      expect(qs.parse('?' + qs.stringify(obj))).toEqual(obj)
    })
  })
})
