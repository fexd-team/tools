import isArray from './isArray'

const flatten = <T = any>(array: any[], deep: number = Infinity): T[] =>
  array.reduce(
    (res, item) => [
      ...res,
      ...(isArray(item) && deep > 0 ? flatten(item, deep - 1) : [item]),
    ],
    []
  )

export default flatten
