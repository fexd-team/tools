import toFixed from '../toFixed'

describe('toFixed', () => {
  test('默认保留2位小数', () => {
    expect(toFixed(3.14159)).toBe(3.14)
    expect(toFixed(3.145)).toBe(3.15)
  })

  test('指定小数位数', () => {
    expect(toFixed(3.14159, 3)).toBe(3.142)
    expect(toFixed(3.14159, 0)).toBe(3)
    expect(toFixed(3.14159, 5)).toBe(3.14159)
  })

  test('返回 number 类型', () => {
    expect(typeof toFixed(3.14)).toBe('number')
  })

  test('默认值 0', () => {
    expect(toFixed()).toBe(0)
    expect(toFixed(undefined)).toBe(0)
  })

  test('整数', () => {
    expect(toFixed(10, 2)).toBe(10)
  })

  test('负数', () => {
    expect(toFixed(-3.14159)).toBe(-3.14)
    expect(toFixed(-3.145)).toBe(-3.15)
  })
})
