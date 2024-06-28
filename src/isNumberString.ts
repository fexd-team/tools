import isString from './isString'

const isNumberString = (value: any): boolean => {
  // 判断传入的值是否为字符串类型，如果不是，则返回false
  if (!isString(value)) {
    return false
  }

  // 使用正则表达式判断字符串是否为数字字符串，如果是，则返回true，否则返回false
  return /^[-+]?\d+(\.\d+)?$/.test(value)
}

export default isNumberString
