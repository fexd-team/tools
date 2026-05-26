/**
 * 判断值是否为 undefined
 * @param value - 要检查的值
 * @returns 如果是 undefined 返回 true
 */
const isUndefined = (value: any): value is undefined =>
  typeof value === 'undefined'

export default isUndefined
