import deepMapItem from '../deepMapItem'

describe('deepMapItem', () => {
  test('遍历嵌套对象', () => {
    const obj = { a: { b: { c: 1 } } }
    const keys: string[] = []
    deepMapItem(obj, {
      handleItem: (item, key) => {
        if (key !== undefined) keys.push(key)
        return item
      },
    })
    expect(keys).toContain('a')
    expect(keys).toContain('b')
    expect(keys).toContain('c')
  })

  test('遍历嵌套数组', () => {
    const arr = [1, [2, [3]]]
    const keys: number[] = []
    deepMapItem(arr, {
      handleItem: (item, key) => {
        if (typeof key === 'number') keys.push(key)
        return item
      },
    })
    expect(keys).toContain(0)
    expect(keys).toContain(1)
  })

  test('handleItem 转换叶子节点', () => {
    const obj = { a: { b: 1 }, c: { d: 2 } }
    const result = deepMapItem(obj, {
      handleItem: (item, key) => {
        if (key === 'b' || key === 'd') return item * 10
        return item
      },
    })
    expect(result).toEqual({ a: { b: 10 }, c: { d: 20 } })
  })

  test('filterItem 跳过某些节点', () => {
    const obj = { a: { b: 2, c: 3 }, d: 4 }
    const visited: string[] = []
    deepMapItem(obj, {
      handleItem: (item, key) => {
        if (key !== undefined) visited.push(key)
        return item
      },
      filterItem: (item, key) => key !== 'b',
    })
    expect(visited).toContain('a')
    expect(visited).not.toContain('b')
    expect(visited).toContain('c')
    expect(visited).toContain('d')
  })

  test('prefixKeys 追踪路径', () => {
    const obj = { a: { b: 1 } }
    const paths: string[][] = []
    deepMapItem(obj, {
      handleItem: (item, key, keyPath) => {
        paths.push(keyPath)
        return item
      },
    })
    expect(paths.some((p) => p.join('.') === 'a.b')).toBe(true)
  })

  test('原始值直接处理', () => {
    const result = deepMapItem(42, {
      handleItem: (item) => (typeof item === 'number' ? item + 1 : item),
    })
    expect(result).toBe(43)
  })

  test('空对象返回空对象', () => {
    expect(deepMapItem({})).toEqual({})
  })

  test('空数组返回空数组', () => {
    expect(deepMapItem([])).toEqual([])
  })
})
