import shallowMerge from '../shallowMerge'

describe('shallowMerge', () => {
  test('合并两个对象', () => {
    expect(shallowMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('后覆盖前', () => {
    expect(shallowMerge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({
      a: 1,
      b: 3,
      c: 4,
    })
  })

  test('合并多个对象', () => {
    expect(shallowMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({
      a: 1,
      b: 2,
      c: 3,
    })
  })

  test('嵌套对象直接覆盖（浅合并）', () => {
    const result = shallowMerge({ a: { x: 1 } }, { a: { y: 2 } })
    expect(result).toEqual({ a: { y: 2 } })
  })

  test('不修改第一个参数', () => {
    const obj = { a: 1 }
    shallowMerge(obj, { b: 2 })
    expect(obj).toEqual({ a: 1 })
  })

  test('空对象不影响', () => {
    expect(shallowMerge({ a: 1 }, {})).toEqual({ a: 1 })
  })

  test('null 参数被安全跳过', () => {
    expect(shallowMerge(null, { a: 1 })).toEqual({ a: 1 })
    expect(shallowMerge({ a: 1 }, null)).toEqual({ a: 1 })
  })

  test('undefined 参数被安全跳过', () => {
    expect(shallowMerge(undefined, { a: 1 })).toEqual({ a: 1 })
    expect(shallowMerge({ a: 1 }, undefined)).toEqual({ a: 1 })
  })
})
