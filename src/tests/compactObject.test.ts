import compactObject from '../compactObject'

describe('compactObject', () => {
  test('过滤 null 和 undefined', () => {
    const result = compactObject({ a: 1, b: null, c: undefined })
    expect(result).toEqual({ a: 1 })
  })

  test('过滤空字符串', () => {
    const result = compactObject({ a: 1, b: '', c: 'hello' })
    expect(result).toEqual({ a: 1, c: 'hello' })
  })

  test('保留 0 值', () => {
    const result = compactObject({ a: 0, b: null, c: false })
    expect(result).toEqual({ a: 0, c: false })
  })

  test('保留 falsy 字符串值', () => {
    const result = compactObject({ a: '0', b: 'false' })
    expect(result).toEqual({ a: '0', b: 'false' })
  })

  test('空对象返回空对象', () => {
    expect(compactObject({})).toEqual({})
  })

  test('null/undefined 输入返回空对象', () => {
    expect(compactObject(null as any)).toEqual({})
    expect(compactObject(undefined as any)).toEqual({})
  })

  test('所有值都为空时返回空对象', () => {
    const result = compactObject({ a: null, b: undefined, c: '' })
    expect(result).toEqual({})
  })

  test('保留嵌套对象（不递归）', () => {
    const result = compactObject({ a: { b: 1 }, c: '' })
    expect(result).toEqual({ a: { b: 1 } })
  })
})
