import randomRGB from '../randomRGB'

describe('randomRGB', () => {
  test('返回 # 开头的十六进制颜色', () => {
    const color = randomRGB()
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  test('默认 min=0 时各通道 >= 0', () => {
    for (let i = 0; i < 50; i++) {
      const color = randomRGB()
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(255)
      expect(g).toBeGreaterThanOrEqual(0)
      expect(b).toBeGreaterThanOrEqual(0)
    }
  })

  test('指定 min 值时各通道 >= min', () => {
    const min = 200
    for (let i = 0; i < 50; i++) {
      const color = randomRGB(min)
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      expect(r).toBeGreaterThanOrEqual(min)
      expect(g).toBeGreaterThanOrEqual(min)
      expect(b).toBeGreaterThanOrEqual(min)
    }
  })

  test('每次调用生成不同颜色', () => {
    const colors = Array.from({ length: 50 }, () => randomRGB())
    const uniqueCount = new Set(colors).size
    expect(uniqueCount).toBeGreaterThan(1)
  })
})
