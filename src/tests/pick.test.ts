import pick from '../pick'

describe('pick', () => {
  test('挑选指定属性', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  test('挑选不存在的属性被忽略', () => {
    expect(pick({ a: 1 }, ['b'] as any)).toEqual({})
  })

  test('空 keys 返回空对象', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({})
  })

  test('不传 keys 返回所有属性', () => {
    expect(pick({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('空对象', () => {
    expect(pick({}, ['a'])).toEqual({})
  })

  test('保留 falsy 值', () => {
    expect(
      pick({ a: 0, b: '', c: false, d: null }, ['a', 'b', 'c', 'd'])
    ).toEqual({
      a: 0,
      b: '',
      c: false,
      d: null,
    })
  })

  test('部分 keys 存在部分不存在', () => {
    expect(pick({ a: 1, b: 2 }, ['a', 'c'] as any)).toEqual({ a: 1 })
  })

  test('包含 undefined 值', () => {
    expect(pick({ a: undefined, b: 2 }, ['a', 'b'])).toEqual({
      a: undefined,
      b: 2,
    })
  })
})
