/**
 * 判断值是否为 null 或 undefined
 * @param value - 要检查的值
 * @returns 如果是 null 或 undefined 返回 true
 */
const isNil = (value: any): value is null | undefined =>
  value === null || value === undefined

export default isNil
