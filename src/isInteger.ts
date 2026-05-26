import isFinite from './isFinite'

/**
 * 判断值是否为整数
 * @param value - 要检查的值
 * @returns 如果是整数返回 true
 */
const isInteger = (value: any): value is number =>
  isFinite(value) && Math.floor(value) === value

export default isInteger
