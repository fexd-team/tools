import isBigNumber, { trimZeros } from '../isBigNumber'

describe('isBigNumber', () => {
  test('trimZeros 正常工作', () => {
    expect(trimZeros('00000010000.0000011000000')).toBe('10000.0000011')
    expect(trimZeros('000123456')).toBe('123456')
    expect(trimZeros('100.0000')).toBe('100')
    expect(trimZeros('-000900')).toBe('-900')
    expect(trimZeros('0')).toBe('0')
    expect(trimZeros('000')).toBe('0')
    expect(trimZeros('000.000')).toBe('0')
  })

  // ── 安全整数边界 ──
  test('MAX_SAFE_INTEGER 边界', () => {
    expect(isBigNumber('9007199254740991')).toBe(false)   // MAX_SAFE_INTEGER
    expect(isBigNumber('9007199254740992')).toBe(true)    // 2^53, 不再是安全整数
    expect(isBigNumber('9007199254740993')).toBe(true)    // MAX_SAFE + 2
    expect(isBigNumber('9007199254740994')).toBe(true)    // 2^53 + 2, float64 精确但不安全
    expect(isBigNumber('9007199254740995')).toBe(true)
  })

  test('MIN_SAFE_INTEGER 边界', () => {
    expect(isBigNumber('-9007199254740991')).toBe(false)  // MIN_SAFE_INTEGER
    expect(isBigNumber('-9007199254740992')).toBe(true)
    expect(isBigNumber('-9007199254740993')).toBe(true)
  })

  test('超大整数', () => {
    expect(isBigNumber('12345678987654321')).toBe(true)
    expect(isBigNumber('123456789012345678901234567890')).toBe(true)
    expect(isBigNumber('99999999999999999')).toBe(true)
  })

  // ── 科学计数法 ──
  test('科学计数法 - 大数字', () => {
    expect(isBigNumber('9.007199254740993e15')).toBe(true)
    expect(isBigNumber('1e20')).toBe(true)
    expect(isBigNumber('1e308')).toBe(true)
  })

  test('科学计数法 - 非大数字', () => {
    expect(isBigNumber('1.5e+15')).toBe(false)
    expect(isBigNumber('5e-7')).toBe(false)
    expect(isBigNumber('1.23e2')).toBe(false)
    expect(isBigNumber('1e0')).toBe(false)
  })

  // ── 负数 & 零 ──
  test('负数和零的边界', () => {
    expect(isBigNumber('-0')).toBe(false)
    expect(isBigNumber('-0.001')).toBe(false)
    expect(isBigNumber('-0.1')).toBe(false)
    expect(isBigNumber('0')).toBe(false)
    expect(isBigNumber('+0')).toBe(false)
  })

  // ── 普通小数 & 安全数 ──
  test('普通小数不是大数字', () => {
    expect(isBigNumber('123.456')).toBe(false)
    expect(isBigNumber('0.000000001')).toBe(false)
    expect(isBigNumber('0.01')).toBe(false)
    expect(isBigNumber('0.100')).toBe(false)
    expect(isBigNumber('100.0')).toBe(false)
    expect(isBigNumber('00000010000.0000011000000')).toBe(false)
  })

  test('实际业务数据（曾触发 bug）', () => {
    expect(isBigNumber('1501338859614.04')).toBe(false)
    expect(isBigNumber('1535646638956.47')).toBe(false)
    expect(isBigNumber('1325583790746.05')).toBe(false)
    expect(isBigNumber('100000000000000.1')).toBe(false)
  })

  test('普通安全整数', () => {
    expect(isBigNumber('1000')).toBe(false)
    expect(isBigNumber('1000.01')).toBe(false)
  })

  // ── 前导零处理 ──
  test('前导零', () => {
    expect(isBigNumber('000123456')).toBe(false)
    expect(isBigNumber('-0009007199254740992')).toBe(true)
    expect(isBigNumber('-000')).toBe(false)
    expect(isBigNumber('000')).toBe(false)
  })

  // ── 无效输入 ──
  test('无效的数字格式', () => {
    expect(isBigNumber('1,000')).toBe(false)
    expect(isBigNumber('1000.')).toBe(false)
    expect(isBigNumber('0..01')).toBe(false)
    expect(isBigNumber('1000..01')).toBe(false)
    expect(isBigNumber('.01')).toBe(false)
    expect(isBigNumber('1,000.01')).toBe(false)
    expect(isBigNumber('')).toBe(false)
    expect(isBigNumber(' 123 ')).toBe(false)
    expect(isBigNumber('abc')).toBe(false)
    expect(isBigNumber('foo123')).toBe(false)
    expect(isBigNumber('NaN')).toBe(false)
    expect(isBigNumber('Infinity')).toBe(false)
  })

  test('非字符串类型', () => {
    expect(isBigNumber(1000)).toBe(false)
    expect(isBigNumber(true)).toBe(false)
    expect(isBigNumber([])).toBe(false)
    expect(isBigNumber({})).toBe(false)
    expect(isBigNumber(null)).toBe(false)
    expect(isBigNumber(undefined)).toBe(false)
  })

  // ── 科学计数法浮点路径边界 ──
  test('科学计数法 - 浮点路径（展开后正确处理）', () => {
    expect(isBigNumber('5e-7')).toBe(false)
    expect(isBigNumber('1.5e-3')).toBe(false)
    expect(isBigNumber('0.5e-10')).toBe(false)
    expect(isBigNumber('1.23456e3')).toBe(false)
  })

  test('浮点精度丢失边界', () => {
    expect(isBigNumber('9007199254740990.7')).toBe(false)
    expect(isBigNumber('999999999999999.9')).toBe(false)
    expect(isBigNumber('99999999999999999.9')).toBe(true)
  })

  test('Infinity 溢出', () => {
    expect(isBigNumber('1e309')).toBe(true)
    expect(isBigNumber('-1e309')).toBe(true)
  })
})
