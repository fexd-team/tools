/**
 * 判断值是否为 Date 实例
 * @param value - 要检查的值
 * @returns 如果是 Date 实例返回 true
 */
const isDate = (value: any): value is Date => {
  if (value instanceof Date) return true
  return Object.prototype.toString.call(value) === '[object Date]'
}

export default isDate
