import sample from '../sample'

describe('sample', () => {
  test('从数组中随机抽取一个元素', () => {
    const arr = [1, 2, 3, 4, 5]
    for (let i = 0; i < 50; i++) {
      const result = sample(arr)
      expect(arr).toContain(result)
    }
  })

  test('单元素数组', () => {
    expect(sample([42])).toBe(42)
  })

  test('空数组返回 undefined', () => {
    expect(sample([])).toBeUndefined()
  })

  test('字符串数组', () => {
    const arr = ['a', 'b', 'c']
    const result = sample(arr)
    expect(arr).toContain(result)
  })

  test('对象数组', () => {
    const arr = [{ id: 1 }, { id: 2 }]
    const result = sample(arr)
    expect(arr).toContain(result)
  })
})
