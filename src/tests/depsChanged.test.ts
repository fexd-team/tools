import depsChanged from '../depsChanged'

describe('depsChanged', () => {
  test('相同数组返回 false', () => {
    expect(depsChanged([1, 2, 3], [1, 2, 3])).toBe(false)
  })

  test('不同元素返回 true', () => {
    expect(depsChanged([1, 2, 3], [1, 2, 4])).toBe(true)
  })

  test('不同长度返回 true', () => {
    expect(depsChanged([1, 2], [1, 2, 3])).toBe(true)
  })

  test('空数组相同', () => {
    expect(depsChanged([], [])).toBe(false)
  })

  test('对象引用比较', () => {
    const obj = { a: 1 }
    expect(depsChanged([obj], [obj])).toBe(false)
    expect(depsChanged([obj], [{ a: 1 }])).toBe(true)
  })

  test('多元素比较', () => {
    expect(depsChanged([1, 'a', true], [1, 'a', true])).toBe(false)
    expect(depsChanged([1, 'a', true], [1, 'a', false])).toBe(true)
  })

  test('null/undefined 输入抛错', () => {
    expect(() => depsChanged(null as any, [])).toThrow()
    expect(() => depsChanged(undefined as any, [])).toThrow()
    expect(() => depsChanged([], null as any)).toThrow()
  })
})
