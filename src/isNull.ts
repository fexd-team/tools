/**
 * 判断值是否为 null
 * @param value - 要检查的值
 * @returns 如果是 null 返回 true
 */
const isNull = (value: any): value is null => value === null

export default isNull
