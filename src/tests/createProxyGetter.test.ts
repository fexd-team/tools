import createProxyGetter from '../createProxyGetter'

describe('createProxyGetter', () => {
  test('通过 handler 访问属性', () => {
    const obj = { a: 1, b: 2 }
    const proxy = createProxyGetter(obj, (value) => value * 2)
    expect(proxy.a).toBe(2)
    expect(proxy.b).toBe(4)
  })

  test('handler 接收 prop 参数', () => {
    const obj = { a: 1, b: 2 }
    const proxy = createProxyGetter(obj, (value, prop) => `${prop}:${value}`)
    expect(proxy.a).toBe('a:1')
    expect(proxy.b).toBe('b:2')
  })

  test('不存在的属性返回 undefined', () => {
    const obj = { a: 1 }
    const proxy = createProxyGetter(obj, (value) => value)
    expect(proxy.b).toBeUndefined()
  })

  test('handler 不是函数时返回 handler 本身', () => {
    const obj = { a: 1 }
    const proxy = createProxyGetter(obj, 'static' as any)
    expect(proxy.a).toBe('static')
  })

  test('空对象', () => {
    const proxy = createProxyGetter({}, (value) => value)
    expect(proxy.a).toBeUndefined()
  })

  test('Proxy 构造失败时返回原对象', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const OrigProxy = global.Proxy
    global.Proxy = function () {
      throw new TypeError('Proxy not supported')
    } as any
    const obj = { a: 1 }
    const result = createProxyGetter(obj, (value) => value)
    expect(result).toBe(obj)
    expect(consoleSpy).toHaveBeenCalled()
    global.Proxy = OrigProxy
    consoleSpy.mockRestore()
  })
})
