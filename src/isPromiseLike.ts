import isExist from './isExist'
import isFunction from './isFunction'

/**
 * 判断值是否为 Promise-like
 * @param value - 要检查的值
 * @returns 如果是 Promise-like 返回 true
 */
const isPromiseLike = (value: any): value is Promise<any> =>
  isExist(value) && isFunction(value.then)

export default isPromiseLike
