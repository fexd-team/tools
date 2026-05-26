import isExist from './isExist'

const hasSymbolIterator =
  typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined'

/**
 * 判断值是否实现了 ES 迭代协议（具有 Symbol.iterator）
 * 在不支持 Symbol 的环境中回退为检查数组和字符串
 * @param value - 要检查的值
 * @returns 如果实现了迭代协议返回 true
 */
const isIterable = (value: any): boolean => {
  if (!isExist(value)) return false
  if (hasSymbolIterator) {
    return typeof value[Symbol.iterator] === 'function'
  }
  return Array.isArray(value) || typeof value === 'string'
}

export default isIterable
