import uniqByKey from '../uniqByKey'

describe('uniqByKey', () => {
  test('根据 key 去重', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ]
    expect(uniqByKey(arr, 'id')).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ])
  })

  test('没有重复返回原数组', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(uniqByKey(arr, 'id')).toEqual(arr)
  })

  test('空数组返回空数组', () => {
    expect(uniqByKey([], 'id')).toEqual([])
  })

  test('不包含 key 的项总是保留', () => {
    const arr = [{ id: 1 }, { name: 'no-id' }, { id: 1 }]
    expect(uniqByKey(arr, 'id')).toEqual([{ id: 1 }, { name: 'no-id' }])
  })

  test('默认空数组', () => {
    expect(uniqByKey(undefined as any, 'id')).toEqual([])
  })

  test('字符串 key 去重', () => {
    const arr = [
      { name: 'a', val: 1 },
      { name: 'b', val: 2 },
      { name: 'a', val: 3 },
    ]
    expect(uniqByKey(arr, 'name')).toEqual([
      { name: 'a', val: 1 },
      { name: 'b', val: 2 },
    ])
  })
})
