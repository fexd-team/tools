import isNumberString from './isNumberString'
import expandScientificNumberString from './expandScientificNumberString'

export function trimZeros(value: string): string {
  // 去掉前导和尾随空格
  value = value.trim()
  // 去掉前导零
  value = value.replace(/^(-?)0+(?=\d)/, '$1')
  // 如果有小数点，去掉尾随零
  if (value.includes('.')) {
    value = value.replace(/\.?0+$/, '')
  }
  return value
}

/**
 * 判断值是否为大数字
 * @param value - 要检查的值
 * @returns 如果是大数字返回 true
 */
const isBigNumber = (value: any): boolean => {
  if (!isNumberString(value)) {
    return false
  }

  const num = Number(value)

  if (!Number.isFinite(num)) {
    return true
  }

  if (Number.isInteger(num)) {
    return !Number.isSafeInteger(num)
  }

  const expanded = expandScientificNumberString(String(value))
  const trimmed = trimZeros(expanded)
  if (trimmed === '-0') {
    return false
  }

  const [integerPart] = trimmed.split('.')

  if (integerPart === '-0' || integerPart === '0' || integerPart === '') {
    return false
  }

  return String(Number(integerPart)) !== integerPart
}

export default isBigNumber
