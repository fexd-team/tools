import isUndefined from './isUndefined'
import isNull from './isNull'

/**
 * 判断值是否存在（非 null 且非 undefined）
 * @param value - 要检查的值
 * @returns 如果值存在返回 true
 */
const isExist = (value: any): boolean => !(isUndefined(value) || isNull(value))

export default isExist
