import createSeparatorFormatter from '../createSeparatorFormatter'

describe('createSeparatorFormatter - isNumber 模式', () => {
  const fmt = createSeparatorFormatter({ isNumber: true, separator: ',' })

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

  test('字符串数字', () => {
    expect(fmt('1234' as any)).toBe('1,234')
  })

  test('自定义分隔符', () => {
    const dotFmt = createSeparatorFormatter({ isNumber: true, separator: '.' })
    expect(dotFmt(1000000)).toBe('1.000.000')
  })

  test('separator=. 时小数点自动变为逗号（欧式）', () => {
    const euroFmt = createSeparatorFormatter({ isNumber: true, separator: '.' })
    expect(euroFmt(1234567.89)).toBe('1.234.567,89')
    expect(euroFmt(0.5)).toBe('0,5')
    expect(euroFmt(-1000.99)).toBe('-1.000,99')
  })

  test('显式指定 decimalSeparator 覆盖自动推断', () => {
    const fmt = createSeparatorFormatter({
      isNumber: true,
      separator: '.',
      decimalSeparator: '#',
    })
    expect(fmt(1234.56)).toBe('1.234#56')
  })

  test('separator=, 且未配置 decimalSeparator 时小数点保持 .', () => {
    const fmt = createSeparatorFormatter({ isNumber: true, separator: ',' })
    expect(fmt(1234.56)).toBe('1,234.56')
  })

  test('显式 decimalSeparator 与 separator=, 配合', () => {
    const fmt = createSeparatorFormatter({
      isNumber: true,
      separator: ',',
      decimalSeparator: '·',
    })
    expect(fmt(9876543.21)).toBe('9,876,543·21')
  })

  test('自定义长度 - 每隔 4 位', () => {
    const fmt4 = createSeparatorFormatter({
      isNumber: true,
      separator: ',',
      length: 4,
    })
    expect(fmt4(12345678)).toBe('1234,5678')
  })
})

describe('createSeparatorFormatter - 默认模式 (非 isNumber)', () => {
  test('自定义分隔符和长度', () => {
    const fmt = createSeparatorFormatter({ separator: '-', length: 4 })
    expect(fmt('1234567890')).toBe('12-3456-7890')
  })

  test('银行卡号格式化', () => {
    const fmt = createSeparatorFormatter({ separator: ' ', length: 4 })
    expect(fmt('6222021234567890')).toBe('6222 0212 3456 7890')
  })

  test('reverse=true 从左到右分组', () => {
    const fmt = createSeparatorFormatter({
      separator: ' ',
      length: 3,
      reverse: true,
    })
    expect(fmt('1234567')).toBe('123 456 7')
  })

  test('reverse=false 从右到左分组（默认）', () => {
    const fmt = createSeparatorFormatter({
      separator: ' ',
      length: 3,
      reverse: false,
    })
    expect(fmt('1234567')).toBe('1 234 567')
  })

  test('number 输入被 Math.floor 取整后格式化', () => {
    const fmt = createSeparatorFormatter({ separator: ',', length: 3 })
    expect(fmt(1234.56)).toBe('1,234')
  })

  test('undefined 输入返回 undefined', () => {
    const fmt = createSeparatorFormatter()
    expect(fmt(undefined as any)).toBeUndefined()
  })

  test('默认选项 - separator 空格, length 3', () => {
    const fmt = createSeparatorFormatter()
    expect(fmt('abcdef')).toBe('abc def')
  })
})
