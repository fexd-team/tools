const _isArray =
  typeof Array.isArray === 'function'
    ? Array.isArray
    : (value: any) => Object.prototype.toString.call(value) === '[object Array]'

/**
 * 判断值是否为数组
 * @param value - 要检查的值
 * @returns 如果是数组返回 true
 */
const isArray = (value: any): value is Array<any> => _isArray(value)

export default isArray
