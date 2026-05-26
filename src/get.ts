import isString from './isString'
import isUndefined from './isUndefined'
import isNumber from './isNumber'

export type KType = string | any[] | number

/**
 * 按路径从对象中安全取值
 * @param obj - 源对象
 * @param keys - 属性路径，支持点号字符串、数组或数字索引
 * @param defaultValue - 路径不存在时的默认值
 * @returns 路径对应的值，不存在时返回 defaultValue
 */
export default function get<T = any>(
  obj: any,
  keys: KType = [],
  defaultValue?: any
): T {
  try {
    if (isNumber(keys)) {
      keys = String(keys)
    }
    let result = (
      isString(keys) ? (keys as string).split('.') : (keys as any[])
    ).reduce((res, key) => res[key], obj)
    return isUndefined(result) ? defaultValue : result
  } catch (e) {
    return defaultValue
  }
}
