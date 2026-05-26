import isString from './isString'
import isObject from './isObject'
import isArray from './isArray'
import get, { KType } from './get'

/**
 * 按路径向对象中安全设值，返回新对象副本
 * @param obj - 目标对象
 * @param keys - 属性路径，支持点号字符串或数组
 * @param value - 要设置的值
 * @returns 设置后的新对象
 */
const set = (
  obj: Record<string, any> = {},
  keys: KType = [],
  value?: any
): Record<string, any> => {
  obj = Object.assign({}, obj)
  keys = isString(keys) ? (keys as string).split('.') : keys
  ;(keys as any[]).reduce((res, key, idx) => {
    let next = idx === (keys as string).length - 1 ? value : get(res, key, {})

    if (isObject(next)) {
      next = Object.assign({}, next)
    }

    if (isArray(next)) {
      next = next.slice()
    }

    res[key] = next

    return res[key]
  }, obj)

  return obj
}

export default set
