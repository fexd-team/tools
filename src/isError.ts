import root from './globalThis'
import isUndefined from './isUndefined'

const errorTypes = [
  'Error',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',
]
  .map((key) => root[key])
  .filter((type) => !isUndefined(type))

const raw_isError = (value: any): boolean =>
  errorTypes.some((errorType) => value instanceof errorType)

/**
 * 判断值是否为 Error 实例
 * @param value - 要检查的值
 * @returns 如果是 Error 实例返回 true
 */
const isError = (value: any): boolean => {
  if (value instanceof Error) return true
  if (raw_isError(value)) return true
  return Object.prototype.toString.call(value) === '[object Error]'
}

export default isError
