import isArray from './isArray'

/**
 * 将数组按指定深度扁平化
 * @param array - 源数组
 * @param deep - 扁平化深度，默认 Infinity
 * @returns 扁平化后的新数组
 */
const flatten = <T = any>(array: any[], deep: number = Infinity): T[] =>
  array.reduce(
    (res, item) => [
      ...res,
      ...(isArray(item) && deep > 0 ? flatten(item, deep - 1) : [item]),
    ],
    []
  )

export default flatten
