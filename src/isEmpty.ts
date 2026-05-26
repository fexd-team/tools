import isArray from './isArray'

/**
 * 判断值是否为"空"
 * - null / undefined → true
 * - 字符串：长度为 0 → true
 * - 数组：长度为 0 → true
 * - Map / Set：size 为 0 → true
 * - 对象：无自身可枚举属性 → true
 * - 其他类型（number, boolean, function 等）→ true
 * @param value - 要检查的值
 * @returns 如果为空返回 true
 */
const isEmpty = (value: any): boolean => {
  if (value == null) return true
  if (typeof value === 'string' || isArray(value)) return value.length === 0
  if (typeof Map !== 'undefined' && value instanceof Map)
    return value.size === 0
  if (typeof Set !== 'undefined' && value instanceof Set)
    return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return true
}

export default isEmpty
