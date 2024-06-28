// import React from 'react'
// import { render, screen, act, fireEvent } from '@testing-library/react'
// import { delay } from '@fexd/tools'

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

  test('isBigNumber 正常工作', () => {
    // 字符串测试
    expect(isBigNumber('12345678987654321')).toBe(true)
    expect(isBigNumber('9007199254740995')).toBe(true)
    expect(isBigNumber('9007199254740994')).toBe(false)
    expect(isBigNumber('9007199254740993')).toBe(true)
    expect(isBigNumber('9007199254740992')).toBe(false)
    expect(isBigNumber('9007199254740991')).toBe(false)

    expect(isBigNumber('1000')).toBe(false)
    expect(isBigNumber('0.01')).toBe(false)
    expect(isBigNumber('1000.01')).toBe(false)
    expect(isBigNumber('1,000')).toBe(false)
    expect(isBigNumber('1000.')).toBe(false)
    expect(isBigNumber('0..01')).toBe(false)
    expect(isBigNumber('1000..01')).toBe(false)
    expect(isBigNumber('.01')).toBe(false)
    expect(isBigNumber('1,000.01')).toBe(false)
    // 其他类型测试
    expect(isBigNumber(1000)).toBe(false)
    expect(isBigNumber(true)).toBe(false)
    expect(isBigNumber([])).toBe(false)
    expect(isBigNumber({})).toBe(false)

    expect(isBigNumber('9007199254740991')).toBe(false) //, 等于 MAX_SAFE_INTEGER
    expect(isBigNumber('9007199254740992')).toBe(false) //, 大于 MAX_SAFE_INTEGER
    expect(isBigNumber('123456789012345678901234567890')).toBe(true) //, 远大于 MAX_SAFE_INTEGER
    expect(isBigNumber('-9007199254740991')).toBe(false) //, 等于 MIN_SAFE_INTEGER
    expect(isBigNumber('-9007199254740992')).toBe(false) //, 小于 MIN_SAFE_INTEGER
    expect(isBigNumber('000123456')).toBe(false) //, 前导零处理
    expect(isBigNumber('-0009007199254740992')).toBe(false) //, 负数前导零处理
    expect(isBigNumber('0.100')).toBe(false) //, 小数且整数部分不大
    expect(isBigNumber('foo123')).toBe(false) //, 非数字字符串
    expect(isBigNumber('100.0')).toBe(false) //, 小数且整数部分不大
    expect(isBigNumber('-000')).toBe(false) //, 单个零
    expect(isBigNumber('000')).toBe(false) //, 单个零
    expect(isBigNumber('')).toBe(false) //, 空字符串
    expect(isBigNumber(' 123 ')).toBe(false) //, 包含空格的字符串
    expect(isBigNumber('00000010000.0000011000000')).toBe(false) //, 前导和尾随零处理
  })
})
