import pipe from './pipe'
import flatten from './flatten'

/**
 * 返回多个数组的交集
 * @param args - 参与交集运算的数组
 * @returns 同时出现在所有数组中的元素
 */
const intersection = (...args) =>
  pipe<any[]>(
    flatten,
    (_: any[]) => new Set(_),
    Array.from
  )(args).filter((item) => args.every((arr) => arr.includes(item)))

export default intersection
