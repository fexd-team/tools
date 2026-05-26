/**
 * 判断值是否为布尔值
 * @param value - 要检查的值
 * @returns 如果是布尔值返回 true
 */
const isBoolean = (value: any): value is boolean => typeof value === 'boolean'

export default isBoolean
