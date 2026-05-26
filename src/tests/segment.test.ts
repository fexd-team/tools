import segment from '../segment'

describe('segment', () => {
  test('均匀分段', () => {
    const result = segment(100, 4, [20, 30])
    expect(result.length).toBe(4)
    expect(result.reduce((sum, v) => sum + v, 0)).toBeCloseTo(100)
  })

  test('每段在 min 和 max 范围内', () => {
    const result = segment(100, 4, [20, 30])
    result.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(20)
      expect(v).toBeLessThanOrEqual(30)
    })
  })

  test('无法分段时抛出错误 - 平均值小于 min', () => {
    expect(() => segment(100, 4, [30, 40])).toThrow('无法分段')
  })

  test('无法分段时抛出错误 - 平均值大于 max', () => {
    expect(() => segment(100, 4, [5, 10])).toThrow('无法分段')
  })

  test('1 段', () => {
    const result = segment(100, 1, [50, 150])
    expect(result).toEqual([100])
  })

  test('2 段', () => {
    const result = segment(100, 2, [40, 60])
    expect(result.length).toBe(2)
    expect(result.reduce((sum, v) => sum + v, 0)).toBeCloseTo(100)
  })

  test('总和等于 length', () => {
    const result = segment(200, 5, [30, 50])
    expect(result.reduce((sum, v) => sum + v, 0)).toBeCloseTo(200)
  })
})
