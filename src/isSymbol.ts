/**
 * 判断值是否为 Symbol 类型
 * @param value - 要检查的值
 * @returns 如果是 Symbol 返回 true
 */
const isSymbol = (value: any): value is symbol => typeof value === 'symbol'

export default isSymbol
