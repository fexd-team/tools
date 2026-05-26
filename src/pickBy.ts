import run from './run'
import isExist from './isExist'

/**
 * 按谓词条件选取对象的键值对
 * @param obj - 源对象
 * @param predicate - 过滤函数，接收 (value, key)
 * @returns 满足条件的新对象
 */
const pickBy = (
  obj: Record<string, any>,
  predicate: (...args: any[]) => boolean = (val) => isExist(val)
): Record<string, any> =>
  Object.entries(obj)
    .filter((entries) => run(predicate, undefined, entries[1], entries[0]))
    .reduce(
      (res, entries) => ({
        ...res,
        [entries[0]]: entries[1],
      }),
      {}
    )

export default pickBy
