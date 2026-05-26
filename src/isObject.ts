import isArray from './isArray'
import isNull from './isNull'

/**
 * 判断值是否为对象
 * @param value - 要检查的值
 * @returns 如果是对象返回 true
 */
const isObject = (value: any): boolean =>
  typeof value === 'object' && !(isArray(value) || isNull(value))

export default isObject
