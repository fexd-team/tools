import intersection from '../intersection'

describe('intersection', () => {
  test('两个数组的交集', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
  })

  test('无交集返回空数组', () => {
    expect(intersection([1, 2], [3, 4])).toEqual([])
  })

  test('完全相同的数组', () => {
    expect(intersection([1, 2], [1, 2])).toEqual([1, 2])
  })

  test('三个数组的交集', () => {
    expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3])
  })

  test('空数组参与', () => {
    expect(intersection([], [1, 2])).toEqual([])
  })

  test('多个空数组', () => {
    expect(intersection([], [])).toEqual([])
  })

  test('字符串数组', () => {
    expect(intersection(['a', 'b'], ['b', 'c'])).toEqual(['b'])
  })

  test('去重结果', () => {
    const result = intersection([1, 1, 2], [1, 1, 3])
    expect(result).toEqual([1])
  })
})
