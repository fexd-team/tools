import get from '../get'

describe('get', () => {
  const obj = { a: { b: { c: 3 } }, d: [{ e: 5 }], f: null }

  test('点号路径获取值', () => {
    expect(get(obj, 'a.b.c')).toBe(3)
  })

  test('数组路径获取值', () => {
    expect(get(obj, ['a', 'b', 'c'])).toBe(3)
  })

  test('数字键自动转字符串', () => {
    expect(get(obj, 'd.0.e')).toBe(5)
  })

  test('number 类型 keys', () => {
    expect(get({ 0: 'zero' }, 0 as any)).toBe('zero')
  })

  test('路径不存在返回 undefined', () => {
    expect(get(obj, 'a.b.c.d')).toBeUndefined()
  })

  test('路径不存在返回默认值', () => {
    expect(get(obj, 'a.b.c.d', 'default')).toBe('default')
  })

  test('中间路径为 null 返回默认值', () => {
    expect(get(obj, 'f.x', 'default')).toBe('default')
  })

  test('空 keys 返回整个对象', () => {
    expect(get(obj)).toBe(obj)
  })

  test('空字符串 keys', () => {
    expect(get(obj, '')).toBeUndefined()
  })

  test('对象为 null 返回默认值', () => {
    expect(get(null, 'a', 'default')).toBe('default')
  })

  test('对象为 undefined 返回默认值', () => {
    expect(get(undefined, 'a', 'default')).toBe('default')
  })

  test('获取数组值', () => {
    expect(get([10, 20, 30], '1')).toBe(20)
  })

  test('获取 falsy 值', () => {
    expect(get({ a: 0 }, 'a')).toBe(0)
    expect(get({ a: '' }, 'a')).toBe('')
    expect(get({ a: false }, 'a')).toBe(false)
  })

  test('值为 undefined 时返回默认值', () => {
    expect(get({ a: undefined }, 'a', 'default')).toBe('default')
  })
})
