/**
 * 判断值是否为字符串
 * @param value - 要检查的值
 * @returns 如果是字符串返回 true
 */
export default function isString(value: any): value is string {
  return typeof value === 'string'
}
