import flatten from '../flatten'

describe('flatten', () => {
  test('一维数组不变', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
  })

  test('二维数组展平', () => {
    expect(
      flatten([
        [1, 2],
        [3, 4],
      ])
    ).toEqual([1, 2, 3, 4])
  })

  test('三维数组深度展平', () => {
    expect(flatten([[[1, 2]], [[3]]])).toEqual([1, 2, 3])
  })

  test('混合深度', () => {
    expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5])
  })

  test('空数组', () => {
    expect(flatten([])).toEqual([])
  })

  test('嵌套空数组', () => {
    expect(flatten([[], [[]], [[], []]])).toEqual([])
  })

  test('指定深度为 0 不展平', () => {
    expect(flatten([[1, 2], [3]], 0)).toEqual([[1, 2], [3]])
  })

  test('指定深度为 1 展平一层', () => {
    expect(flatten([[1, [2, 3]], [4]], 1)).toEqual([1, [2, 3], 4])
  })

  test('指定深度为 2 展平两层', () => {
    expect(flatten([[[1, 2]], [[3]]], 2)).toEqual([1, 2, 3])
  })

  test('包含非数组元素', () => {
    expect(flatten([1, 'hello', [true, null]])).toEqual([
      1,
      'hello',
      true,
      null,
    ])
  })

  test('默认深度为 Infinity（完全展平）', () => {
    const deep = [1, [2, [3, [4, [5]]]]]
    expect(flatten(deep)).toEqual([1, 2, 3, 4, 5])
  })
})
