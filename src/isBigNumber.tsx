// import BigNumber from 'bignumber.js'
import isNumberString from './isNumberString'

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

const isBigNumber = (value: any): boolean => {
  // 判断传入的值是否为数字字符串，如果不是，则返回false
  if (!isNumberString(value)) {
    return false
  }

  value = trimZeros(value)

  if (value === '-0') {
    return false
  }

  // 分离整数部分和小数部分
  const [integerPart, decimalPart] = value.split('.')

  // 检查整数部分是否溢出
  const isIntegerPartBig = String(Number(integerPart)) !== integerPart

  return isIntegerPartBig
}

export default isBigNumber
