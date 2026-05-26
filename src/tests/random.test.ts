import random from '../random'

describe('random', () => {
  test('返回范围内的整数', () => {
    for (let i = 0; i < 100; i++) {
      const result = random(1, 10)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThan(10)
      expect(Number.isInteger(result)).toBe(true)
    }
  })

  test('int=false 返回浮点数', () => {
    const results = Array.from({ length: 100 }, () => random(0, 1, false))
    const hasDecimal = results.some((r) => !Number.isInteger(r))
    expect(hasDecimal).toBe(true)
  })

  test('int=true 返回整数', () => {
    const result = random(0, 100, true)
    expect(Number.isInteger(result)).toBe(true)
  })

  test('负数范围', () => {
    const result = random(-10, -1)
    expect(result).toBeGreaterThanOrEqual(-10)
    expect(result).toBeLessThan(-1)
  })

  test('范围只有一个整数', () => {
    for (let i = 0; i < 50; i++) {
      const result = random(5, 6)
      expect(result).toBe(5)
    }
  })

  test('min 等于 max 时返回 min', () => {
    for (let i = 0; i < 50; i++) {
      expect(random(5, 5)).toBe(5)
    }
    expect(random(0, 0)).toBe(0)
    expect(random(-3, -3)).toBe(-3)
  })
})
