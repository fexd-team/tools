import clamp from '../clamp'

describe('clamp', () => {
  test('值在范围内返回原值', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  test('值小于最小值返回最小值', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })

  test('值大于最大值返回最大值', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  test('值等于最小值', () => {
    expect(clamp(0, 0, 10)).toBe(0)
  })

  test('值等于最大值', () => {
    expect(clamp(10, 0, 10)).toBe(10)
  })

  test('负数范围', () => {
    expect(clamp(-5, -10, -1)).toBe(-5)
    expect(clamp(-15, -10, -1)).toBe(-10)
    expect(clamp(0, -10, -1)).toBe(-1)
  })

  test('小数', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5)
    expect(clamp(-0.1, 0, 1)).toBe(0)
    expect(clamp(1.5, 0, 1)).toBe(1)
  })

  test('省略 max 参数时默认为 Number.MAX_VALUE', () => {
    expect(clamp(5, 0)).toBe(5)
    expect(clamp(999999, 0)).toBe(999999)
    expect(clamp(-1, 0)).toBe(0)
  })

  test('min 和 max 相同', () => {
    expect(clamp(5, 3, 3)).toBe(3)
    expect(clamp(3, 3, 3)).toBe(3)
  })

  test('0 值', () => {
    expect(clamp(0, -1, 1)).toBe(0)
    expect(clamp(0, 1, 10)).toBe(1)
  })
})
