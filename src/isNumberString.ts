import isString from './isString'

const isNumberString = (value: any): boolean => {
  // 判断传入的值是否为字符串类型，如果不是，则返回false
  if (!isString(value)) {
    return false
  }

  return /^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(value)
}

export default isNumberString
