import {
  param,
  allParam,
  generateParamStr,
  paramEscape,
  allParamEscape,
} from '../url'

describe('url - param', () => {
  test('从 URL 中提取参数', () => {
    expect(param('name', '?name=test&other=1')).toBe('test')
  })

  test('参数不存在返回 undefined', () => {
    expect(param('missing', '?a=1&b=2')).toBeUndefined()
  })

  test('参数值为空字符串', () => {
    expect(param('key', '?key=')).toBe('')
  })

  test('自定义 URL 字符串', () => {
    expect(param('id', '?id=123&name=abc')).toBe('123')
  })

  test('编码的参数值自动解码', () => {
    expect(param('q', '?q=hello%20world')).toBe('hello world')
  })

  test('无 ? 前缀返回 undefined', () => {
    expect(param('name', 'name=test')).toBeUndefined()
  })
})

describe('url - paramEscape', () => {
  test('使用 unescape 解码', () => {
    const result = paramEscape('key', '?key=hello%20world')
    expect(result).toBe('hello world')
  })
})

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

  test('特殊字符编码', () => {
    const result = allParam('?url=http%3A%2F%2Fexample.com')
    expect(result.url).toBe('http://example.com')
  })

  test('多个同名参数只取最后一个', () => {
    const result = allParam('?a=1&a=2')
    expect(result.a).toBe('2')
  })
})

describe('url - allParamEscape', () => {
  test('使用 unescape 解码', () => {
    const result = allParamEscape('?key=hello%20world')
    expect(result.key).toBe('hello world')
  })
})

describe('url - safeDecode fallback', () => {
  test('decodeURIComponent 失败时降级到 decodeURI', () => {
    const malformed = '%E0%A4%A'
    const result = param('v', `?v=${malformed}`)
    expect(result).toBeDefined()
  })

  test('所有解码器失败时返回原始值', () => {
    const orig = {
      decodeURIComponent: globalThis.decodeURIComponent,
      decodeURI: globalThis.decodeURI,
      unescape: globalThis.unescape,
    }
    globalThis.decodeURIComponent = () => {
      throw new Error()
    }
    globalThis.decodeURI = () => {
      throw new Error()
    }
    globalThis.unescape = () => {
      throw new Error()
    }

    const result = param('v', '?v=raw')
    expect(result).toBe('raw')

    Object.assign(globalThis, orig)
  })
})

describe('url - generateParamStr', () => {
  test('基础对象转查询字符串', () => {
    const result = generateParamStr({ a: '1', b: '2' })
    expect(result).toContain('a=1')
    expect(result).toContain('b=2')
    expect(result.startsWith('?')).toBe(true)
  })

  test('编码特殊字符', () => {
    const result = generateParamStr({ url: 'http://example.com?a=1' })
    expect(result).toContain('url=')
    expect(result).not.toContain('url=http://example.com?a=1')
  })

  test('空值参数', () => {
    const result = generateParamStr({ key: '' })
    expect(result).toContain('key=')
  })

  test('空对象', () => {
    const result = generateParamStr({})
    expect(result).toBe('?')
  })

  test('多个参数用 & 连接', () => {
    const result = generateParamStr({ x: '1', y: '2' })
    expect(result).toMatch(/\?.+&.+/)
  })
})
