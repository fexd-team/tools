import isObject from './isObject'
import isArray from './isArray'
import isReactValidElement from './isReactValidElement'

/**
 * 判断值是否为纯对象
 * @param value - 要检查的值
 * @returns 如果是纯对象返回 true
 */
const isPlainObject = (value: any): boolean => {
  if (!isObject(value) || isArray(value) || isReactValidElement(value))
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export default isPlainObject
