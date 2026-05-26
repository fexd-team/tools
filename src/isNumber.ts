import isNaN from './isNaN'

/**
 * 判断值是否为 number 类型（排除 NaN）
 * @param value - 要检查的值
 * @returns 如果是有效数字返回 true
 */
const isNumber = (value: any): value is number =>
  typeof value === 'number' && !isNaN(value)

export default isNumber
