import isExist from './isExist'

/**
 * 过滤对象中的空值（null、undefined、空字符串）
 * @param obj - 源对象
 * @returns 仅保留有效键值对的新对象
 */
const compactObject = (obj: Record<string, any>): Record<string, any> => {
  if (!obj) return {}
  return Object.keys(obj).reduce((prev: Record<string, any>, key: string) => {
    if (isExist(obj[key]) && obj[key] !== '') {
      prev[key] = obj[key]
    }
    return prev
  }, {})
}

export default compactObject
