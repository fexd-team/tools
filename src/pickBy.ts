import run from './run'
import isExist from './isExist'

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
