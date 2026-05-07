import getFormatter from '../getFormatter'

describe('getFormatter - isNumber 模式', () => {
  const fmt = getFormatter({ isNumber: true, separator: ',' })

  test('数字 0 应正确格式化', () => {
    expect(fmt(0)).toBe('0')
  })

  test('整数千分位', () => {
    expect(fmt(1000)).toBe('1,000')
    expect(fmt(1000000)).toBe('1,000,000')
    expect(fmt(123456789)).toBe('123,456,789')
  })

  test('小数千分位', () => {
    expect(fmt(1234.56)).toBe('1,234.56')
    expect(fmt(0.5)).toBe('0.5')
    expect(fmt(1000000.99)).toBe('1,000,000.99')
  })

  test('小数字不需要分隔', () => {
    expect(fmt(1)).toBe('1')
    expect(fmt(12)).toBe('12')
    expect(fmt(123)).toBe('123')
  })

  test('负数', () => {
    expect(fmt(-1000)).toBe('-1,000')
    expect(fmt(-1234.56)).toBe('-1,234.56')
  })

  test('null 和 undefined 返回空字符串', () => {
    expect(fmt(null)).toBe('')
    expect(fmt(undefined)).toBe('')
  })
})

describe('getFormatter - 默认模式', () => {
  test('自定义分隔符和长度', () => {
    const fmt = getFormatter({ separator: '-', length: 4 })
    const result = fmt('1234567890')
    expect(result).toContain('-')
  })

  test('字符串分隔', () => {
    const fmt = getFormatter({ separator: ' ', length: 4 })
    const result = fmt('6222021234567890')
    expect(result).toContain(' ')
  })
})
