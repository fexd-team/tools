/**
 * 判断值是否为函数
 * @param value - 要检查的值
 * @returns 如果是函数返回 true
 */
const isFunction = (value: any): value is Function =>
  typeof value === 'function'

export default isFunction
