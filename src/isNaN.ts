/**
 * 判断值是否为 NaN
 * @param value - 要检查的值
 * @returns 如果是 NaN 返回 true
 */
const isNaN = (value: any): value is typeof NaN => value !== value

export default isNaN
