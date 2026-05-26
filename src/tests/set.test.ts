import set from '../set'

describe('set', () => {
  test('设置一级属性', () => {
    expect(set({}, 'a', 1)).toEqual({ a: 1 })
  })

  test('设置嵌套属性', () => {
    expect(set({}, 'a.b.c', 3)).toEqual({ a: { b: { c: 3 } } })
  })

  test('覆盖已有属性', () => {
    expect(set({ a: 1 }, 'a', 2)).toEqual({ a: 2 })
  })

  test('不修改原对象', () => {
    const obj = { a: 1 }
    set(obj, 'b', 2)
    expect(obj).toEqual({ a: 1 })
  })

  test('数组路径', () => {
    expect(set({}, ['a', 'b'], 2)).toEqual({ a: { b: 2 } })
  })

  test('设置数组中的值', () => {
    const obj = { list: [1, 2, 3] }
    expect(set(obj, 'list.0', 10)).toEqual({ list: [10, 2, 3] })
  })

  test('值为 undefined', () => {
    expect(set({ a: 1 }, 'a', undefined)).toEqual({ a: undefined })
  })

  test('值为 null', () => {
    expect(set({ a: 1 }, 'a', null)).toEqual({ a: null })
  })

  test('空路径', () => {
    const obj = { a: 1 }
    expect(set(obj, '', 'val')).toEqual({ a: 1, '': 'val' })
  })

  test('obj 默认为空对象', () => {
    expect(set(undefined, 'a', 1)).toEqual({ a: 1 })
  })

  test('keys 默认为空数组', () => {
    const result = set({ a: 1 })
    expect(result).toEqual({ a: 1 })
  })

  test('保留未修改的嵌套属性', () => {
    const obj = { a: { b: 1, c: 2 } }
    const result = set(obj, 'a.b', 10)
    expect(result.a.b).toBe(10)
    expect(result.a.c).toBe(2)
  })

  test('设置对象值', () => {
    expect(set({}, 'a', { x: 1 })).toEqual({ a: { x: 1 } })
  })
})
