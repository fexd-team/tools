import diffArray from '../diffArray'

describe('diffArray', () => {
  test('基本新增和删除', () => {
    const result = diffArray([1, 2, 3], [2, 3, 4])
    expect(result.add).toEqual([4])
    expect(result.remove).toEqual([1])
    expect(result.diff).toEqual([4, 1])
  })

  test('无变化', () => {
    const result = diffArray([1, 2, 3], [1, 2, 3])
    expect(result.add).toEqual([])
    expect(result.remove).toEqual([])
    expect(result.diff).toEqual([])
  })

  test('全部新增', () => {
    const result = diffArray([], [1, 2])
    expect(result.add).toEqual([1, 2])
    expect(result.remove).toEqual([])
  })

  test('全部删除', () => {
    const result = diffArray([1, 2], [])
    expect(result.add).toEqual([])
    expect(result.remove).toEqual([1, 2])
  })

  test('两个空数组', () => {
    const result = diffArray([], [])
    expect(result.add).toEqual([])
    expect(result.remove).toEqual([])
    expect(result.diff).toEqual([])
  })

  test('字符串数组', () => {
    const result = diffArray(['a', 'b'], ['b', 'c'])
    expect(result.add).toEqual(['c'])
    expect(result.remove).toEqual(['a'])
  })

  test('包含 null 元素', () => {
    const result = diffArray([null, 1], [1])
    expect(result.remove).toEqual([null])
  })

  test('包含 undefined 元素', () => {
    const result = diffArray([undefined], [undefined])
    expect(result.add).toEqual([])
    expect(result.remove).toEqual([])
  })

  test('对象引用 - 相同引用视为相同', () => {
    const obj = { id: 1 }
    const result = diffArray([obj], [obj])
    expect(result.add).toEqual([])
    expect(result.remove).toEqual([])
  })

  test('对象引用 - 不同引用视为不同', () => {
    const result = diffArray([{ id: 1 }], [{ id: 1 }])
    expect(result.add).toEqual([{ id: 1 }])
    expect(result.remove).toEqual([{ id: 1 }])
  })

  test('diff 是 add 和 remove 的合并', () => {
    const result = diffArray([1, 2], [3, 4])
    expect(result.diff).toEqual([...result.add, ...result.remove])
  })

  test('单元素数组', () => {
    const result = diffArray([1], [2])
    expect(result.add).toEqual([2])
    expect(result.remove).toEqual([1])
  })
})
