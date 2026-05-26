import pickBy from '../pickBy'

describe('pickBy', () => {
  test('默认过滤掉 undefined 和 null', () => {
    expect(pickBy({ a: 1, b: undefined, c: null })).toEqual({ a: 1 })
  })

  test('自定义 predicate', () => {
    expect(pickBy({ a: 1, b: 2, c: 3 }, (value) => value > 1)).toEqual({
      b: 2,
      c: 3,
    })
  })

  test('predicate 接收 key 参数', () => {
    expect(pickBy({ a: 1, b: 2 }, (_value, key) => key === 'b')).toEqual({
      b: 2,
    })
  })

  test('空对象返回空对象', () => {
    expect(pickBy({})).toEqual({})
  })

  test('全部被过滤', () => {
    expect(pickBy({ a: undefined, b: null })).toEqual({})
  })

  test('保留 falsy 非 null/undefined 值', () => {
    expect(pickBy({ a: 0, b: '', c: false })).toEqual({ a: 0, b: '', c: false })
  })

  test('predicate 被正确调用且返回值正确', () => {
    const obj = { a: 1, b: 2 }
    const fn = jest.fn().mockReturnValue(true)
    const result = pickBy(obj, fn)
    expect(fn).toHaveBeenCalledWith(1, 'a')
    expect(fn).toHaveBeenCalledWith(2, 'b')
    expect(result).toEqual({ a: 1, b: 2 })
  })

  test('predicate 部分返回 false 时过滤', () => {
    const result = pickBy({ x: 10, y: 0, z: 5 }, (v) => v > 0)
    expect(result).toEqual({ x: 10, z: 5 })
  })
})
