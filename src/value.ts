import isUndefined from './isUndefined'
import run from './run'

/**
 * 依次尝试执行或取值，返回第一个非 undefined 结果
 * @param values - 待尝试的值或函数
 * @returns 第一个有效结果
 */
const value = <T = any>(...values: any[]): T =>
  values.reduce(
    (value, nextValue) => (isUndefined(value) ? run(nextValue) : run(value)),
    undefined
  )

export default value
