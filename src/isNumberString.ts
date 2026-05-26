import isString from './isString'

/**
 * 判断值是否为数字字符串
 * @param value - 要检查的值
 * @returns 如果是数字字符串返回 true
 */
const isNumberString = (value: any): boolean => {
  // 判断传入的值是否为字符串类型，如果不是，则返回false
  if (!isString(value)) {
    return false
  }

  return /^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(value)
}

export default isNumberString
