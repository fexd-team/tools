import expandScientificNumberString from '../expandScientificNumberString'

describe('expandScientificNumberString', () => {
  test('正指数 - 大整数', () => {
    expect(expandScientificNumberString('1e20')).toBe('100000000000000000000')
    expect(expandScientificNumberString('1e0')).toBe('1')
    expect(expandScientificNumberString('1e1')).toBe('10')
    expect(expandScientificNumberString('1e308')).toBe('1' + '0'.repeat(308))
  })

  test('正指数 - 带小数的大数', () => {
    expect(expandScientificNumberString('1.5e15')).toBe('1500000000000000')
    expect(expandScientificNumberString('9.007199254740993e15')).toBe('9007199254740993')
    expect(expandScientificNumberString('1.23e2')).toBe('123')
    expect(expandScientificNumberString('1.23456e3')).toBe('1234.56')
  })

  test('负指数 - 极小浮点', () => {
    expect(expandScientificNumberString('5e-7')).toBe('0.0000005')
    expect(expandScientificNumberString('1.5e-3')).toBe('0.0015')
    expect(expandScientificNumberString('1e-1')).toBe('0.1')
    expect(expandScientificNumberString('1e-20')).toBe('0.' + '0'.repeat(19) + '1')
  })

  test('负数', () => {
    expect(expandScientificNumberString('-3.14e10')).toBe('-31400000000')
    expect(expandScientificNumberString('-5e-7')).toBe('-0.0000005')
    expect(expandScientificNumberString('-1e20')).toBe('-100000000000000000000')
  })

  test('非科学计数法 - 原样返回', () => {
    expect(expandScientificNumberString('123.456')).toBe('123.456')
    expect(expandScientificNumberString('9007199254740993')).toBe('9007199254740993')
    expect(expandScientificNumberString('0')).toBe('0')
    expect(expandScientificNumberString('-0.001')).toBe('-0.001')
  })

  test('大写 E', () => {
    expect(expandScientificNumberString('1.5E+15')).toBe('1500000000000000')
    expect(expandScientificNumberString('5E-7')).toBe('0.0000005')
  })

  test('带 + 号的指数', () => {
    expect(expandScientificNumberString('1.5e+15')).toBe('1500000000000000')
    expect(expandScientificNumberString('1e+20')).toBe('100000000000000000000')
  })

  test('带 + 号的前缀（防御性处理）', () => {
    expect(expandScientificNumberString('+1e20')).toBe('100000000000000000000')
    expect(expandScientificNumberString('+1.5e+15')).toBe('1500000000000000')
  })

  test('无效输入防护', () => {
    expect(expandScientificNumberString('' as any)).toBe('')
    expect(expandScientificNumberString(null as any)).toBe(null)
    expect(expandScientificNumberString(undefined as any)).toBe(undefined)
    expect(expandScientificNumberString(123 as any)).toBe(123)
  })

  test('包含 e 但非法的字符串 - 原样返回', () => {
    expect(expandScientificNumberString('hello_e_world')).toBe('hello_e_world')
  })
})
