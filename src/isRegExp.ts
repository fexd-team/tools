/**
 * 判断值是否为正则表达式
 * @param val - 要检查的值
 * @returns 如果是正则表达式返回 true
 */
const isRegExp = (val: any): val is RegExp => {
  if (val instanceof RegExp) return true
  return Object.prototype.toString.call(val) === '[object RegExp]'
}

export default isRegExp
