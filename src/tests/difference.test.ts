import difference from '../difference'

describe('difference', () => {
  test('基本差集', () => {
    expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1])
  })

  test('没有差集时返回空数组', () => {
    expect(difference([1, 2], [1, 2])).toEqual([])
  })

  test('第一个数组为空', () => {
    expect(difference([], [1, 2])).toEqual([])
  })

  test('第二个数组为空', () => {
    expect(difference([1, 2], [])).toEqual([1, 2])
  })

  test('两个数组都为空', () => {
    expect(difference([], [])).toEqual([])
  })

  test('完全不同的数组', () => {
    expect(difference([1, 2], [3, 4])).toEqual([1, 2])
  })

  test('字符串数组', () => {
    expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c'])
  })

  test('包含重复元素', () => {
    expect(difference([1, 1, 2], [2])).toEqual([1, 1])
  })

  test('包含对象引用', () => {
    const obj = { id: 1 }
    expect(difference([obj, { id: 2 }], [obj])).toEqual([{ id: 2 }])
  })

  test('NaN 不被 includes 识别', () => {
    expect(difference([NaN, 1], [NaN])).toEqual([1])
  })
})
